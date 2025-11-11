import express from 'express';
import { authMiddleware } from '../auth.js';
import { runDb, getAllDb, getDb_single } from '../db.js';

const router = express.Router();

// Get all bingo cards with squares
router.get('/cards', async (req, res) => {
    try {
        const cards = await getAllDb(`
            SELECT bc.*, u.username as author_name
            FROM bingo_cards bc
            LEFT JOIN users u ON bc.user_id = u.id
            ORDER BY bc.created_at DESC
        `);

        // Get squares for each card
        const cardsWithSquares = await Promise.all(
            cards.map(async (card) => {
                const squares = await getAllDb(
                    'SELECT * FROM bingo_squares WHERE bingo_card_id = ? ORDER BY position',
                    [card.id]
                );
                return { ...card, squares };
            })
        );

        res.json(cardsWithSquares);
    } catch (error) {
        console.error('Error fetching bingo cards:', error);
        res.status(500).json({ error: 'Failed to fetch bingo cards' });
    }
});

// Get user's bingo card for today (if exists)
router.get('/my-card', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Check if user already created a card today
        const today = new Date().toISOString().split('T')[0];

        const card = await getDb_single(`
            SELECT bc.*, u.username as author_name
            FROM bingo_cards bc
            LEFT JOIN users u ON bc.user_id = u.id
            WHERE bc.user_id = ? AND DATE(bc.created_at) = ?
        `, [userId, today]);

        if (!card) {
            return res.json(null);
        }

        const squares = await getAllDb(
            'SELECT * FROM bingo_squares WHERE bingo_card_id = ? ORDER BY position',
            [card.id]
        );

        res.json({ ...card, squares });
    } catch (error) {
        console.error('Error fetching user bingo card:', error);
        res.status(500).json({ error: 'Failed to fetch bingo card' });
    }
});

// Create a bingo card
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, squares } = req.body;

        if (!title || !Array.isArray(squares) || squares.length !== 9) {
            return res.status(400).json({ error: 'Title and exactly 9 squares are required' });
        }

        // Check if user already created a card today
        const today = new Date().toISOString().split('T')[0];

        const existingCard = await getDb_single(`
            SELECT id FROM bingo_cards
            WHERE user_id = ? AND DATE(created_at) = ?
        `, [userId, today]);

        if (existingCard) {
            return res.status(400).json({ error: 'You can only create one bingo card per day' });
        }

        // Create bingo card
        const cardResult = await runDb(
            'INSERT INTO bingo_cards (user_id, title) VALUES (?, ?)',
            [userId, title]
        );

        // Create squares
        for (let i = 0; i < squares.length; i++) {
            await runDb(
                'INSERT INTO bingo_squares (bingo_card_id, position, text) VALUES (?, ?, ?)',
                [cardResult.id, i, squares[i]]
            );
        }

        // Get the created card
        const card = await getDb_single(
            'SELECT * FROM bingo_cards WHERE id = ?',
            [cardResult.id]
        );

        const squaresData = await getAllDb(
            'SELECT * FROM bingo_squares WHERE bingo_card_id = ? ORDER BY position',
            [cardResult.id]
        );

        res.status(201).json({ ...card, squares: squaresData });
    } catch (error) {
        console.error('Error creating bingo card:', error);
        res.status(500).json({ error: 'Failed to create bingo card' });
    }
});

// Toggle square check
router.post('/card/:cardId/square/:squareId/toggle', authMiddleware, async (req, res) => {
    try {
        const { cardId, squareId } = req.params;
        const userId = req.user.userId;

        // Verify user owns this card
        const card = await getDb_single(
            'SELECT id FROM bingo_cards WHERE id = ? AND user_id = ?',
            [cardId, userId]
        );

        if (!card) {
            return res.status(403).json({ error: 'You can only modify your own bingo card' });
        }

        // Get current state
        const square = await getDb_single(
            'SELECT checked FROM bingo_squares WHERE id = ? AND bingo_card_id = ?',
            [squareId, cardId]
        );

        if (!square) {
            return res.status(404).json({ error: 'Square not found' });
        }

        // Toggle checked state
        const newState = square.checked ? 0 : 1;
        await runDb(
            'UPDATE bingo_squares SET checked = ? WHERE id = ?',
            [newState, squareId]
        );

        res.json({ checked: newState });
    } catch (error) {
        console.error('Error toggling square:', error);
        res.status(500).json({ error: 'Failed to toggle square' });
    }
});

export default router;

