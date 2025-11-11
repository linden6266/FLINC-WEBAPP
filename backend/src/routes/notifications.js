import express from 'express';
import { authMiddleware } from '../auth.js';
import { runDb, getDb_single, getAllDb } from '../db.js';

const router = express.Router();

// Get all notifications for logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notifications = await getAllDb(`
      SELECT * FROM notifications 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `, [req.user.userId]);

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const notificationId = req.params.id;

        await runDb(
            'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
            [notificationId, req.user.userId]
        );

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// Mark all notifications as read
router.put('/mark-all/read', authMiddleware, async (req, res) => {
    try {
        await runDb(
            'UPDATE notifications SET read = 1 WHERE user_id = ?',
            [req.user.userId]
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error updating notifications:', error);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
});

// Create notification (internal use - called by other routes)
export async function createNotificationForAllUsers(title, message, type = 'info', relatedEventId = null) {
    try {
        // Get all users except the one creating the notification
        const users = await getAllDb('SELECT id FROM users');

        for (const user of users) {
            await runDb(
                'INSERT INTO notifications (user_id, title, message, type, related_event_id) VALUES (?, ?, ?, ?, ?)',
                [user.id, title, message, type, relatedEventId]
            );
        }

        console.log(`✅ Notification created for ${users.length} users`);
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

export default router;

