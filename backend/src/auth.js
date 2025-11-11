import jwt from 'jwt-simple';
import bcrypt from 'bcryptjs';
import { getDb_single } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me';

// Hardcoded admin users - usernames only. You can add more as needed
const ADMIN_USERS = ['admin', 'moderator'];

export function generateToken(userId, username, isAdmin) {
    const payload = {
        userId,
        username,
        isAdmin,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    return jwt.encode(payload, JWT_SECRET);
}

export function verifyToken(token) {
    try {
        return jwt.decode(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

export function isAdminUser(username) {
    return ADMIN_USERS.includes(username.toLowerCase());
}

export function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
}

export function adminMiddleware(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

