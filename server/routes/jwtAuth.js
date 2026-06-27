const router = require('express').Router();
const pool = require('../db/db_connection');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const authorize = require('../middleware/authorization'); // Import the "Bouncer" middleware

/**
 * ============================================================================
 * AUTHENTICATION ROUTES
 * These routes handle the most sensitive part of your API: User Identity.
 * ============================================================================
 */

/**
 * ROUTE: /auth/register
 * PURPOSE: Onboard a new user by creating their identity in the database.
 * ACCESS: PUBLIC (Anyone can register)
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

        // SECURE HASHING
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // PERSISTENCE
        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *",
            [name, email, bcryptPassword]
        );

        // SESSION GRANT
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
 * ACCESS: PUBLIC (Anyone can attempt to login)
 */
router.post('/login', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // IDENTITY LOOKUP
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

        // CREDENTIAL VERIFICATION
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).send("Invalid Password");
        }

        // ISSUE TOKEN
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

/**
 * ROUTE: /auth/profile
 * PURPOSE: Return the user's profile information.
 * ACCESS: PROTECTED (Requires a valid JWT token)
 *
 * Note the 'authorize' middleware inserted here. It runs BEFORE the async function.
 */
router.get('/profile', authorize, async (req, res) => {
    // The 'authorize' middleware has already verified the token
    // and attached the user ID to req.user.
    const userId = req.user.id;

    try {
        const result = await pool.query("SELECT user_id, user_name, user_email FROM users WHERE user_id=$1", [userId]);

        if (result.rows.length === 0) {
            return res.status(404).send("User not found");
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;