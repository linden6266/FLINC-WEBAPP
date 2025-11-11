import { initDb, createSchema, runDb } from '../src/db.js';
import { hashPassword } from '../src/auth.js';

async function initializeDatabase() {
    try {
        console.log('🔧 Initializing database...');

        await initDb();
        await createSchema();

        // Create hardcoded admin users with initial passwords
        // You should change these immediately!
        const adminUsers = [
            { username: 'frank', password: 'Sjaakie123' },
            { username: 'jeroen', password: 'Sjaakie123' }
        ];

        for (const adminUser of adminUsers) {
            try {
                const hashedPassword = await hashPassword(adminUser.password);
                await runDb(
                    'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)',
                    [adminUser.username, hashedPassword, 1]
                );
                console.log(`✅ Created admin user: ${adminUser.username}`);
            } catch (error) {
                if (error.message.includes('UNIQUE constraint failed')) {
                    console.log(`⚠️  Admin user ${adminUser.username} already exists, skipping...`);
                } else {
                    throw error;
                }
            }
        }

        // Create some sample data
        const sampleGames = [
            { title: 'Quiz Master', description: 'Test your knowledge with trivia questions', category: 'Quiz', difficulty: 'Easy', created_by: 1 },
            { title: 'Word Challenge', description: 'Find words in the letter grid', category: 'Word', difficulty: 'Medium', created_by: 1 },
            { title: 'Memory Match', description: 'Match pairs and test your memory', category: 'Memory', difficulty: 'Hard', created_by: 1 }
        ];

        for (const game of sampleGames) {
            try {
                await runDb(
                    'INSERT INTO games (title, description, category, difficulty, created_by) VALUES (?, ?, ?, ?, ?)',
                    [game.title, game.description, game.category, game.difficulty, game.created_by]
                );
                console.log(`✅ Created game: ${game.title}`);
            } catch (error) {
                console.log(`⚠️  Game ${game.title} already exists, skipping...`);
            }
        }

        // Create some sample news
        const sampleNews = [
            { title: 'Welcome to FLINC', content: 'Welcome to the FLINC platform! We\'re excited to have you here.', category: 'Announcement', author_id: 1 },
            { title: 'New Games Available', content: 'Check out our latest games now available in the platform.', category: 'Update', author_id: 1 }
        ];

        for (const news of sampleNews) {
            try {
                await runDb(
                    'INSERT INTO news (title, content, category, author_id) VALUES (?, ?, ?, ?)',
                    [news.title, news.content, news.category, news.author_id]
                );
                console.log(`✅ Created news: ${news.title}`);
            } catch (error) {
                console.log(`⚠️  News ${news.title} already exists, skipping...`);
            }
        }

        console.log('\n✨ Database initialization complete!');
        console.log('\n🔐 Default Admin Credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   ⚠️  CHANGE THESE IMMEDIATELY IN PRODUCTION!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

initializeDatabase();

