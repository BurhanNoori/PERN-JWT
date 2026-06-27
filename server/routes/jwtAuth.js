const router = require('express').Router();
const pool = require('../db/db_connection');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');

/**
 * ============================================================================
 * AUTHENTICATION ROUTES
 * These routes handle the most sensitive part of your API: User Identity.
 * ============================================================================
 */

/**
 * ROUTE: /auth/register
 * PURPOSE: Onboard a new user by creating their identity in the database.
 *
 * PRODUCTION FLOW:
 * 1. Input Validation -> 2. Conflict Check -> 3. Secure Hashing -> 4. Persistence -> 5. Session Grant
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        /**
         * PRODUCTION TIP: Input Validation
         * In a real API, never assume the user sent a valid email or password.
         * Use a library like 'zod' or 'joi' to verify that the email is actually
         * an email and the password meets complexity requirements (e.g., 8+ chars).
         */

        // CONFLICT CHECK: Ensure the identity is unique.
        // Using parameterized queries ($1) is MANDATORY to prevent SQL Injection.
        const user = await pool.query("SELECT * FROM users WHERE user_email=$1", [email]);

        if (user.rows.length !== 0) {
            // 401 Unauthorized or 409 Conflict is appropriate here.
            return res.status(401).send("User Already Exist");
        }

        // SECURE HASHING: Transform plain text into a secure hash.
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // PERSISTENCE: Save to the database.
        // 'RETURNING *' is a Postgres feature that gives us the new record immediately.
        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *",
            [name, email, bcryptPassword]
        );

        // SESSION GRANT: Give the user a "ticket" (JWT) so they don't have to log in again immediately.
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token });

    } catch (error) {
        /**
         * PRODUCTION TIP: Error Logging
         * Never send the raw 'error' object to the client; it could reveal
         * your database structure or internal paths to hackers.
         * Use a logger (Winston/Pino) to save the error for the developers.
         */
        console.error(error.message);
        return res.status(500).send("Server Error");
    }
});

/**
 * ROUTE: /auth/login
 * PURPOSE: Verify identity and issue a new access token.
 */
router.post('/login', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // IDENTITY LOOKUP: Does this person exist?
        const user = await pool.query(
            "SELECT * FROM users WHERE user_name=$1 AND user_email=$2",
            [name, email]
        );

        if (user.rows.length === 0) {
            // PRODUCTION TIP: Avoid "User not found" messages.
            // Saying "Invalid Credentials" is safer because it doesn't tell a hacker
            // if a specific email exists in your system or not.
            return res.status(401).send("Invalid Credentials.");
        }

        // CREDENTIAL VERIFICATION: Compare the provided password with the stored hash.
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).send("Invalid Password");
        }

        // ISSUE TOKEN: User is verified, grant access.
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;