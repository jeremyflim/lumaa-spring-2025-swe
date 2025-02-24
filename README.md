# Task Management Application

This project is a minimal task management application built with React and TypeScript on the frontend, Node.js on the backend, and PostgreSQL as the database. It includes user registration, login (with JWT-based authentication and bcrypt password hashing), and task CRUD operations.

## Table of Contents

- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Testing](#testing)
- [Salary Expectations](#salary-expectations)

## Database Setup

### Prerequisites

- PostgreSQL installed on your system. You can find official downloads [here](https://www.postgresql.org/download/).
- A PostgreSQL client (e.g., `psql` or pgAdmin) to run SQL scripts.

### Steps

1. **Create the Database:**

   Create a new PostgreSQL database (named used in this project is `task_app`)

   ```sql
   CREATE DATABASE task_app;
   ```

2. **Run Migrations:**

   Execute the following SQL commands to create the required tables:

   ```sql
   -- Create the users table
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );

   -- Create the tasks table
   CREATE TABLE tasks (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT,
       "complete" BOOLEAN DEFAULT false,
       "userid" INTEGER REFERENCES users(id)
   );
   ```

3. **Environment Variables:**

   Edit the `.env` file in the server directory. Placeholders/defaults are used, but you should use your own values.

   ```
   PORT=5000
   BCRYPT_SALT_ROUNDS=10
   JWT_SECRET=SECRET_KEY
   DATABASE_URL=postgres://username:password@localhost:5432/task_app
   ```

   At minimum, you should replace `SECRET_KEY`, `username`, and `password` with your own values. You can generate a JWT key [here](https://jwtsecret.com/generate). `username` and `password` should be your PostgreSQL username and password. `5432` is the default port for PostgreSQL, but if you have a different port you should change it to your port.

## Backend Setup

### Prerequisites

- Node.js
- npm

### Steps

1. Navigate to the `server/` directory.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the backend server (development mode):

   ```bash
   npm run dev
   ```
   
4. The server should start on the port specified in your `.env` file (default is `5000`).

## Frontend Setup

### Prerequisites

- Node.js
- npm

### Steps

1. Navigate to the `client/` directory.

2. Edit the `.env` file in the frontend directory. It only has one value:

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

   Adjust the URL if your backend is hosted elsewhere.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the frontend application:

   ```bash
   npm start
   ```

5. The React app will launch in your default browser (typically at `http://localhost:3000`).

## Testing

- **Manual API Testing:**
  - You can use backend testing tools such as Postman to test the backend.
  - **Registration:** `POST /auth/register`
  - **Login:** `POST /auth/login` (retrieve a JWT)
  - **Tasks Endpoints:** Use the JWT in the `authorization` header (e.g., `Bearer <token>`) for:
    - `GET /tasks`
    - `POST /tasks`
    - `PUT /tasks/:id`
    - `DELETE /tasks/:id`

- **UI Testing:**
  - Use the React frontend to perform registration, login, and task CRUD operations.
  - A short video demo is provided in the repository (see `DEMO.md`) demonstrating these operations.

## Salary Expectations

**Salary Expectations per month:** $20-30/hr

Assuming 20 hours a week, 4 weeks a month: $1600-$2400/month

Feel free to reach out if you have any questions regarding the project.
