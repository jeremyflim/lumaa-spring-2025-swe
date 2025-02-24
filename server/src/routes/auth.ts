import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db'
import ERRORS from '../errors'

const router = Router();
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const jwtSecret = String(process.env.JWT_SECRET);   // Set JWT_SECRET in server/.env

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the given password for security
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert username and hashed password into users table
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        res.status(201);

    } catch (err) {
        res.status(500).json({ error: ERRORS.REGISTRATION_FAILED });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Attempt to find the given username in our database
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1', [username]
        );
        if (result.rows.length === 0) {
            res.status(401).json({ error: ERRORS.WRONG_LOGIN });
            return;
        }

        // Check that the correct password was inputted
        const user = result.rows[0];
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            res.status(401).json({ error: ERRORS.WRONG_LOGIN });
            return;
        }

        // Create JWT payload and sign it
        const token = jwt.sign({ userId: user.id }, jwtSecret);
        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: ERRORS.LOGIN_FAILED });
    }
});

export default router;