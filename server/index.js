const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db/db_connection');
const jwtAuth = require('./routes/jwtAuth');
const port = 5300;

// ==========================================
// GLOBAL MIDDLEWARES
// ==========================================

/**
 * PRODUCTION TIP: Body Parsing
 * express.json() is essential for modern APIs. It allows the server to read the 'body' of
 * POST/PUT requests. In a massive production app, you might add size limits here
 * (e.g., app.use(express.json({ limit: '10kb' }))) to prevent Denial of Service (DoS)
 * attacks where a user sends a gigabyte of JSON to crash your server.
 */
app.use(express.json());

/**
 * PRODUCTION TIP: CORS (Cross-Origin Resource Sharing)
 * By default, browsers block requests to a different domain for security.
 * In production, you should NOT use cors() without options. Instead, specify
 * which domains are allowed to call your API:
 * app.use(cors({ origin: 'https://your-official-website.com' }));
 */
app.use(cors());

// ==========================================
// API ROUTES (Routing Layer)
// ==========================================

/**
 * PRODUCTION TIP: Route Versioning
 * Professional APIs usually version their routes (e.g., /api/v1/auth).
 * This prevents breaking the app for users when you introduce major changes in v2.
 * Here, we mount our authentication logic under the '/auth' prefix.
 */
app.use('/auth', jwtAuth);

/**
 * PRODUCTION TIP: Global Error Handling
 * Every production API needs a "Catch-All" error handler at the end of the middleware chain.
 * This prevents the server from crashing and avoids leaking sensitive stack traces to the user.
 * Example:
 * app.use((err, req, res, next) => {
 *    res.status(500).json({ error: 'Something went wrong on our end!' });
 * });
 */

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
