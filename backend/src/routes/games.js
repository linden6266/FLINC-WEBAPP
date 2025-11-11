import express from 'express';
import { authMiddleware, adminMiddleware } from '../auth.js';
import { runDb, getDb_single, getAllDb } from '../db.js';

const router = express.Router();

// Get all games
router.get('/', async (req, res) => {
    try {
        const games = await getAllDb(`
      SELECT g.*, u.username as created_by_name 
      FROM games g 
      LEFT JOIN users u ON g.created_by = u.id
      ORDER BY g.created_at DESC
    `);
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// Get single game
router.get('/:id', async (req, res) => {
    try {
        const game = await getDb_single(`
      SELECT g.*, u.username as created_by_name 
      FROM games g 
      LEFT JOIN users u ON g.created_by = u.id
      WHERE g.id = ?
    `, [req.params.id]);

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

// Create game - admin only
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, category, difficulty } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = await runDb(
            'INSERT INTO games (title, description, category, difficulty, created_by) VALUES (?, ?, ?, ?, ?)',
            [title, description || null, category || null, difficulty || null, req.user.userId]
        );

        const game = await getDb_single('SELECT * FROM games WHERE id = ?', [result.id]);
        res.status(201).json(game);
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ error: 'Failed to create game' });
    }
});

// Update game - admin only
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, category, difficulty } = req.body;
        const gameId = req.params.id;

        // Check if game exists
        const game = await getDb_single('SELECT * FROM games WHERE id = ?', [gameId]);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        await runDb(
            'UPDATE games SET title = ?, description = ?, category = ?, difficulty = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [title || game.title, description || game.description, category || game.category, difficulty || game.difficulty, gameId]
        );

        const updatedGame = await getDb_single('SELECT * FROM games WHERE id = ?', [gameId]);
        res.json(updatedGame);
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).json({ error: 'Failed to update game' });
    }
});

// Delete game - admin only
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const gameId = req.params.id;

        // Check if game exists
        const game = await getDb_single('SELECT * FROM games WHERE id = ?', [gameId]);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        await runDb('DELETE FROM games WHERE id = ?', [gameId]);
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).json({ error: 'Failed to delete game' });
    }
});

export default router;

