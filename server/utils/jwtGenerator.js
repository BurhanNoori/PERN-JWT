const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * UTILITY FUNCTION: jwtGenerator
 * PURPOSE: Creates a signed JSON Web Token (JWT) for a specific user.
 *
 * HOW IT WORKS:
 * A JWT is like a digital passport. It contains a payload (user info) and a
 * cryptographic signature. The signature is created using a secret key.
 * If a user tries to change their ID in the token, the signature will no longer match,
 * and the server will reject the token.
 *
 * @param {string} user_id - The unique ID of the user to be encoded in the token.
 * @returns {string} - A signed JWT string.
 */
function jwtGenerator(user_id) {
    // 1. Define the payload.
    // PRODUCTION TIP: Keep the payload minimal.
    // Do NOT put sensitive data like passwords or credit card numbers here,
    // because JWTs can be easily decoded by anyone using a tool like jwt.io.
    const payload = {
        user: {
            id: user_id
        }
    };

    // 2. Sign the token.
    // PRODUCTION TIP: Expiration is critical.
    // { expiresIn: "1h" } means if a token is stolen, the attacker only has 1 hour to use it.
    // In a production system, you would typically use a "Refresh Token" strategy
    // to give the user a better experience while maintaining high security.
    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
}

module.exports = jwtGenerator;