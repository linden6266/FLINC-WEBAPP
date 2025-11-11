import express from 'express';
import { authMiddleware } from '../auth.js';
import { runDb, getAllDb, getDb_single } from '../db.js';

const router = express.Router();

// Get daily leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const leaderboard = await getAllDb(`
            SELECT
                qs.score,
                qs.completed_at,
                u.username as name,
                u.id as user_id
            FROM quiz_scores qs
            LEFT JOIN users u ON qs.user_id = u.id
            WHERE DATE(qs.completed_at) = ?
            ORDER BY qs.score DESC, qs.completed_at ASC
            LIMIT 10
        `, [today]);

        // Format leaderboard with avatars
        const formattedLeaderboard = leaderboard.map((entry, index) => ({
            name: entry.name || 'Anoniem',
            score: entry.score,
            rank: index + 1,
            avatar: `https://ui-avatars.com/api/?name=${entry.name || 'User'}&background=004E89&color=fff`,
            completed_at: entry.completed_at
        }));

        res.json(formattedLeaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// Check if user has already attempted quiz today
router.get('/attempt-today', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date().toISOString().split('T')[0];

        const attempt = await getDb_single(
            'SELECT id FROM quiz_attempts WHERE user_id = ? AND attempt_date = ?',
            [userId, today]
        );

        res.json({ attempted: !!attempt });
    } catch (error) {
        console.error('Error checking quiz attempt:', error);
        res.status(500).json({ error: 'Failed to check quiz attempt' });
    }
});

// Submit quiz score
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { score, totalQuestions } = req.body;

        if (typeof score !== 'number' || score < 0 || score > 100) {
            return res.status(400).json({ error: 'Invalid score' });
        }

        const today = new Date().toISOString().split('T')[0];

        // Check if user already attempted today
        const existingAttempt = await getDb_single(
            'SELECT id FROM quiz_attempts WHERE user_id = ? AND attempt_date = ?',
            [userId, today]
        );

        if (existingAttempt) {
            return res.status(400).json({ error: 'You can only attempt the quiz once per day' });
        }

        // Insert attempt record
        await runDb(
            'INSERT INTO quiz_attempts (user_id, attempt_date) VALUES (?, ?)',
            [userId, today]
        );

        // Insert score record
        const scoreResult = await runDb(
            'INSERT INTO quiz_scores (user_id, score, total_questions) VALUES (?, ?, ?)',
            [userId, score, totalQuestions || 5]
        );

        // Get user's position on leaderboard
        const userPosition = await getDb_single(`
            SELECT COUNT(*) + 1 as position
            FROM quiz_scores qs
            WHERE DATE(qs.completed_at) = ?
            AND (qs.score > ? OR (qs.score = ? AND qs.completed_at < ?))
        `, [today, score, score, new Date().toISOString()]);

        res.json({
            success: true,
            position: userPosition?.position || 1,
            score: score
        });
    } catch (error) {
        console.error('Error submitting quiz score:', error);
        res.status(500).json({ error: 'Failed to submit quiz score' });
    }
});

// Get user's best score today
router.get('/my-score', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date().toISOString().split('T')[0];

        const score = await getDb_single(`
            SELECT score, completed_at
            FROM quiz_scores
            WHERE user_id = ? AND DATE(completed_at) = ?
            ORDER BY score DESC
            LIMIT 1
        `, [userId, today]);

        res.json({ score: score?.score || 0, completed_at: score?.completed_at || null });
    } catch (error) {
        console.error('Error fetching user score:', error);
        res.status(500).json({ error: 'Failed to fetch user score' });
    }
});

export default router;

