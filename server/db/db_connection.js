const Pool = require("pg").Pool;
require("dotenv").config(); // Load environment variables from .env file

/**
 * PRODUCTION TIP: Connection Pooling
 * Creating a new database connection for every single request is very slow and can crash your database.
 * We use a 'Pool' which maintains a set of open connections that can be reused.
 *
 * SECURITY WARNING: Never hardcode database credentials in your source code!
 * In a production environment, use environment variables (process.env).
 * Example:
 * const pool = new Pool({
 *     user: process.env.DB_USER,
 *     password: process.env.DB_PASSWORD,
 *     ...
 * });
 */
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Export the pool object. We use this object to run queries (pool.query) throughout the app.
module.exports = pool;