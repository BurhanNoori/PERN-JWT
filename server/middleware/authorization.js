const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * MIDDLEWARE: Authorization (The Bouncer)
 * PURPOSE: To intercept requests to "protected" routes and ensure the user has a valid identity.
 *
 * PRODUCTION DESIGN:
 * This is a "Gatekeeper" pattern. Instead of checking for tokens inside every single
 * route function, we create a reusable piece of middleware that we can "plug in"
 * to any route that requires authentication.
 */
module.exports = async (req, res, next) => {
    try {
        // 1. Retrieve the token from the request headers.
        // PRODUCTION TIP: While 'token' is used here, the industry standard is the
        // 'Authorization' header with the 'Bearer' prefix (e.g., Authorization: Bearer <token>).
        const jwtToken = req.header('token');

        if (!jwtToken) {
            // 403 Forbidden: The server understands the request but refuses to authorize it.
            return res.status(403).send("Not Authorized");
        }

        // 2. Verify the token.
        // jwt.verify doesn't just check if the token exists; it uses the secret key to
        // cryptographically prove that the token was signed by OUR server.
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        // 3. Context Injection.
        // We attach the user's ID to the 'req' object. This is a critical step because
        // it allows the next function in the chain to know exactly WHICH user is acting.
        req.user = payload.user;

        // 4. Proceed to the next handler.
        next();

    } catch (error) {
        /**
         * PRODUCTION TIP: Token Expiry handling.
         * If a token is expired, jwt.verify throws a 'TokenExpiredError'.
         * In a professional API, you would detect this specifically and return a
         * unique error code (e.g., 401) so the frontend knows it should trigger a
         * "Refresh Token" flow rather than just showing an error.
         */
        console.error(error.message);
        res.status(403).send("Not Authorized");
    }
};