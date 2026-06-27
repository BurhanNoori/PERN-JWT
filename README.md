# PERN-JWT Authentication System

This project is a backend authentication system built using the **PERN** stack (PostgreSQL, Express, React, Node.js - *Frontend React part pending*). It allows users to securely register and log in, granting them access to protected resources via JSON Web Tokens (JWT).

## 💡 Key Concepts for Learners

Before diving into the code, here are a few important security concepts used in this project:

- **Password Hashing with Bcrypt**: We never store passwords in plain text. We use `bcrypt` to create a "hash"—a one-way cryptographic representation of the password. This ensures that even if the database is compromised, the actual passwords remain secret.
- **Stateless Auth with JWT**: This project uses JSON Web Tokens (JWT). Unlike traditional sessions where the server must remember every logged-in user in its memory, JWTs are "stateless." The server signs a token and gives it to the user; the user sends it back with every request, and the server simply verifies the signature to know the user is authentic.
- **The Role of `.env`**: We use a `.env` file to store sensitive keys (like the `jwtSecret`). This prevents secrets from being accidentally uploaded to GitHub, where anyone could find them and use them to forge authentication tokens.

---

## 🍳 Project

This guide will help you set up, run, and understand the application from scratch.

### 🛒 Requirements

#### 1. Software & Tools
- **Node.js**: The runtime environment that lets you run JavaScript on your computer.
- **PostgreSQL**: The database where user information is stored.
- **npm**: (Comes with Node.js) The package manager used to install the project's dependencies.
- **Postman or Insomnia**: Tools to test your API (since there is no frontend website yet).

#### 2. Key Libraries (Dependencies)
- `express`: The framework used to build the web server.
- `pg`: The driver that allows Node.js to "talk" to PostgreSQL.
- `bcrypt`: A security library used to scramble (hash) passwords.
- `jsonwebtoken`: The library used to create and verify the JWT "tickets".
- `cors`: Allows your server to be accessed by a frontend running on a different port.
- `dotenv`: Loads secret keys from a hidden file.

---

### 👨‍🍳 Step-by-Step Instructions

#### Step 1: Database Setup
1. Open your PostgreSQL management tool (like **pgAdmin**).
2. Execute the commands found in `server/db/db_model.sql`.
   - This will create a database named `jwtauth`.
   - It will create a `users` table with columns for name, email, and password.
   - It will add some sample users so you have data to test with.

#### Step 2: Environment Configuration
1. Go to the `server` folder.
2. Create a new file named `.env`.
3. Inside this file, add a secret key that only you know:
   ```env
   jwtSecret=my_super_secret_random_key_123
   ```
   *(This key is used to sign your tokens. If someone steals this key, they can fake your login tokens!)*

#### Step 3: Installation
1. Open your terminal/command prompt.
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install all the required libraries:
   ```bash
   npm install
   ```

#### Step 4: Launch the Server
1. Start the server using the script defined in `package.json`:
   ```bash
   npm start
   ```
2. You should see a message: `Server is running on port 5300`.

#### Step 5: Testing the Application
Using Postman or Insomnia, try the following:

**A. Register a New User**
- **URL**: `POST http://localhost:5300/auth/register`
- **Body (JSON)**:
  ```json
  {
    "name": "Your Name",
    "email": "test@example.com",
    "password": "yourpassword123"
  }
  ```
- **Expected Result**: You will receive a `token`. Copy this token!

**B. Login with an Existing User**
- **URL**: `POST http://localhost:5300/auth/login`
- **Body (JSON)**:
  ```json
  {
    "name": "Your Name",
    "email": "test@example.com",
    "password": "yourpassword123"
  }
  ```
- **Expected Result**: You will receive a new `token`.

**C. Use the Token for Authorization**
- If you had a protected route (like `/profile`), you would add a header to your request:
  - **Key**: `token`
  - **Value**: `[Paste the token you received here]`
- The `authorization.js` middleware will check this token and let you in if it's valid.

---

## 📚 Summary of File Roles

- `index.js`: The **Brain**. It starts the server and connects the routes.
- `db_connection.js`: The **Bridge**. It connects the code to the database.
- `db_model.sql`: The **Blueprint**. It defines how the database is structured.
- `jwtAuth.js`: The **Guard**. It handles the logic for registering and logging in.
- `jwtGenerator.js`: The **Ticket Machine**. It creates the JWT tokens.
- `authorization.js`: The **Bouncer**. It checks if a request has a valid token before letting it through.
