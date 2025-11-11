import express from 'express';
import { authMiddleware } from '../auth.js';
import { runDb, getAllDb, getDb_single } from '../db.js';

const router = express.Router();

// ============ LIKES ============

// Get likes count and user's like status for a news item
router.get('/news/:newsId/likes', async (req, res) => {
    try {
        const newsId = req.params.newsId;

        // Get total likes count
        const likesResult = await getDb_single(
            'SELECT COUNT(*) as count FROM likes WHERE news_id = ?',
            [newsId]
        );
        const likeCount = likesResult?.count || 0;

        // Check if current user liked it
        let userLiked = false;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                // Extract userId from request if authenticated
                const userLike = await getDb_single(
                    'SELECT id FROM likes WHERE news_id = ? AND user_id = ?',
                    [newsId, req.user?.userId]
                );
                userLiked = !!userLike;
            } catch (e) {
                userLiked = false;
            }
        }

        res.json({ count: likeCount, userLiked });
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Failed to fetch likes' });
    }
});

// Toggle like on a news item
router.post('/news/:newsId/like', authMiddleware, async (req, res) => {
    try {
        const newsId = req.params.newsId;
        const userId = req.user.userId;

        // Check if already liked
        const existingLike = await getDb_single(
            'SELECT id FROM likes WHERE news_id = ? AND user_id = ?',
            [newsId, userId]
        );

        if (existingLike) {
            // Remove like
            await runDb(
                'DELETE FROM likes WHERE news_id = ? AND user_id = ?',
                [newsId, userId]
            );
        } else {
            // Add like
            await runDb(
                'INSERT INTO likes (user_id, news_id) VALUES (?, ?)',
                [userId, newsId]
            );
        }

        // Get updated count
        const likesResult = await getDb_single(
            'SELECT COUNT(*) as count FROM likes WHERE news_id = ?',
            [newsId]
        );

        res.json({
            liked: !existingLike,
            count: likesResult?.count || 0
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// ============ COMMENTS ============

// Get all comments for a news item
router.get('/news/:newsId/comments', async (req, res) => {
    try {
        const newsId = req.params.newsId;

        const comments = await getAllDb(`
            SELECT c.*, u.username as author_name
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.news_id = ?
            ORDER BY c.created_at DESC
        `, [newsId]);

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Add a comment
router.post('/news/:newsId/comment', authMiddleware, async (req, res) => {
    try {
        const newsId = req.params.newsId;
        const userId = req.user.userId;
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        const result = await runDb(
            'INSERT INTO comments (user_id, news_id, content) VALUES (?, ?, ?)',
            [userId, newsId, content]
        );

        // Get the created comment
        const comment = await getDb_single(`
            SELECT c.*, u.username as author_name
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `, [result.id]);

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Delete a comment (own comments only)
router.delete('/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.userId;

        // Check if comment exists and belongs to user
        const comment = await getDb_single(
            'SELECT id FROM comments WHERE id = ? AND user_id = ?',
            [commentId, userId]
        );

        if (!comment) {
            return res.status(403).json({ error: 'You can only delete your own comments' });
        }

        await runDb('DELETE FROM comments WHERE id = ?', [commentId]);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

export default router;

