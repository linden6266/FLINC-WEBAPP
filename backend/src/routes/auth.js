import express from 'express';
import { generateToken, verifyPassword, hashPassword, isAdminUser } from '../auth.js';
import { runDb, getDb_single } from '../db.js';

const router = express.Router();

// Register - only for hardcoded admin users
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Check if user is an admin user
        if (!isAdminUser(username)) {
            return res.status(403).json({ error: 'Only admin users can register' });
        }

        // Check if user already exists
        const existingUser = await getDb_single('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const result = await runDb(
            'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)',
            [username, hashedPassword, 1]
        );

        res.status(201).json({
            id: result.id,
            username,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = await getDb_single('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordMatch = await verifyPassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.username, user.is_admin);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                isAdmin: Boolean(user.is_admin)
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;

