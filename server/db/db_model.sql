-- ============================================================================
-- DATABASE BLUEPRINT
-- ============================================================================

-- 1. Create the database to hold all our user data
CREATE DATABASE jwtauth;

-- 2. Create the 'users' table to store user information
-- PRODUCTION TIP: Always consider the data types.
-- Using UUID instead of an auto-incrementing Integer (1, 2, 3...) makes it
-- harder for attackers to "guess" your user IDs by just incrementing numbers.
CREATE TABLE users(
    -- uuid_generate_v4() automatically generates a random unique ID.
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- VARCHAR(255) is a standard for names/emails. NOT NULL ensures the field is never empty.
    user_name VARCHAR(255) NOT NULL,

    -- PRODUCTION TIP: Use a UNIQUE constraint on emails.
    -- This prevents the same email from registering twice, which would break the login logic.
    user_email VARCHAR(255) NOT NULL UNIQUE,

    -- Store the hashed password (never plain text!).
    -- 255 characters is plenty for a Bcrypt hash.
    user_password VARCHAR(255) NOT NULL
);

-- PRODUCTION TIP: Database Indexing
-- Since we search for users by email during login, adding an INDEX to user_email
-- makes the database lookup significantly faster as your user base grows.
CREATE INDEX idx_user_email ON users(user_email);

-- 3. Seed the database with some initial sample users for testing purposes.
-- WARNING: These are plain-text passwords for demo purposes only.
-- In production, these would be inserted as Bcrypt hashes.
INSERT INTO users (user_name, user_email, user_password) VALUES ('burhan batawala','burhan.batawala786@gmail.com','passw@rd989');
INSERT INTO users (user_name, user_email, user_password) VALUES ('kishore mangal','kishore.mangal@gmail.com','passw@rd989');
INSERT INTO users (user_name, user_email, user_password) VALUES ('alok nath','alok.kumar@gmail.com','aloknath');
INSERT INTO users (user_name, user_email, user_password) VALUES ('surendra dhakad','surendra.dhakad@avanthapower.com','dhakad123');
INSERT INTO users (user_name, user_email, user_password) VALUES ('rahul roy','rahul.roy@gmail.com','rahulRoy');
