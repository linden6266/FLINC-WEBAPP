import express from 'express';
import { authMiddleware, adminMiddleware } from '../auth.js';
import { runDb, getDb_single, getAllDb } from '../db.js';
import { createNotificationForAllUsers } from './notifications.js';

const router = express.Router();

// Get all news
router.get('/', async (req, res) => {
    try {
        const news = await getAllDb(`
      SELECT n.*, u.username as author_name,
             (SELECT COUNT(*) FROM likes WHERE news_id = n.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE news_id = n.id) as comments_count
      FROM news n 
      LEFT JOIN users u ON n.author_id = u.id
      ORDER BY n.created_at DESC
    `);
        res.json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Get single news article
router.get('/:id', async (req, res) => {
    try {
        const newsArticle = await getDb_single(`
      SELECT n.*, u.username as author_name,
             (SELECT COUNT(*) FROM likes WHERE news_id = n.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE news_id = n.id) as comments_count
      FROM news n 
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.id = ?
    `, [req.params.id]);

        if (!newsArticle) {
            return res.status(404).json({ error: 'News article not found' });
        }
        res.json(newsArticle);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Create news - admin only
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const result = await runDb(
            'INSERT INTO news (title, content, category, author_id) VALUES (?, ?, ?, ?)',
            [title, content, category || null, req.user.userId]
        );

        const newsArticle = await getDb_single('SELECT * FROM news WHERE id = ?', [result.id]);

        // Create notifications for all users about the new event
        const categoryLabel = {
            nieuws: 'Nieuws',
            event: 'Event',
            success: 'Succes',
            verjaardag: 'Verjaardag'
        }[category] || 'Event';

        await createNotificationForAllUsers(
            `Nieuw ${categoryLabel}! 📢`,
            `"${title}" is zojuist geplaatst`,
            'info',
            result.id
        );

        res.status(201).json(newsArticle);
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ error: 'Failed to create news' });
    }
});

// Update news - admin only
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const newsId = req.params.id;

        // Check if news exists
        const newsArticle = await getDb_single('SELECT * FROM news WHERE id = ?', [newsId]);
        if (!newsArticle) {
            return res.status(404).json({ error: 'News article not found' });
        }

        await runDb(
            'UPDATE news SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [title || newsArticle.title, content || newsArticle.content, category || newsArticle.category, newsId]
        );

        const updatedNews = await getDb_single('SELECT * FROM news WHERE id = ?', [newsId]);
        res.json(updatedNews);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ error: 'Failed to update news' });
    }
});

// Delete news - admin only
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newsId = req.params.id;

        // Check if news exists
        const newsArticle = await getDb_single('SELECT * FROM news WHERE id = ?', [newsId]);
        if (!newsArticle) {
            return res.status(404).json({ error: 'News article not found' });
        }

        await runDb('DELETE FROM news WHERE id = ?', [newsId]);
        res.json({ message: 'News article deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
});

export default router;

