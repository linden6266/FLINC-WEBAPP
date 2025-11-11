import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, createSchema } from './db.js';
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';
import newsRoutes from './routes/news.js';
import notificationRoutes from './routes/notifications.js';
import engagementRoutes from './routes/engagement.js';
import bingoRoutes from './routes/bingo.js';
import quizRoutes from './routes/quiz.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/bingo', bingoRoutes);
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

// Start server
async function startServer() {
    try {
        await initDb();
        await createSchema();

        app.listen(PORT, () => {
            console.log(`🚀 FLINC API Server running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation:`);
            console.log(`   - Auth: POST /api/auth/login, POST /api/auth/register`);
            console.log(`   - Games: GET /api/games, POST/PUT/DELETE (admin only)`);
            console.log(`   - News: GET /api/news, POST/PUT/DELETE (admin only)`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

