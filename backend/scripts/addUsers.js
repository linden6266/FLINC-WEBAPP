import { initDb, createSchema, runDb } from '../src/db.js';
import { hashPassword } from '../src/auth.js';

const teamMembers = [
    { username: 'bianca', name: 'Bianca Hooijer' },
    { username: 'gaby', name: 'Gaby Hafkenscheid' },
    { username: 'frank', name: 'Frank van der Linden' },
    { username: 'tom', name: 'Tom Horst' },
    { username: 'tara', name: 'Tara van der Hoorn' },
    { username: 'anne', name: 'Anne Rendel ten Hoff' },
    { username: 'miriam', name: 'Miriam Eikendal' },
    { username: 'ruben', name: 'Ruben Westrik' },
];

async function addUsers() {
    try {
        console.log('🔧 Initializing database...');
        await initDb();
        await createSchema();

        console.log('👥 Adding team members...\n');

        for (const member of teamMembers) {
            try {
                const hashedPassword = await hashPassword('flinc123');
                await runDb(
                    'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)',
                    [member.username, hashedPassword, 0]
                );
                console.log(`✅ ${member.name} (${member.username})`);
            } catch (error) {
                if (error.message.includes('UNIQUE constraint failed')) {
                    console.log(`⚠️  ${member.name} already exists, skipping...`);
                } else {
                    throw error;
                }
            }
        }

        console.log('\n✨ Team members added successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('Password: flinc123');
        console.log('\nUsernames:');
        teamMembers.forEach(member => {
            console.log(`  • ${member.username} (${member.name})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding users:', error);
        process.exit(1);
    }
}

addUsers();

