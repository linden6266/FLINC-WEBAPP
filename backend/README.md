# FLINC Backend API

A comprehensive backend API for the FLINC application with database, authentication, and content management.

## Features

- 🔐 JWT-based authentication with admin role management
- 👤 User accounts (username + password)
- 🎮 Game management (CRUD operations, admin-only)
- 📰 News management (CRUD operations, admin-only)
- 🗄️ SQLite database

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

Create a `.env` file in the backend directory:

```
PORT=5000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

### 3. Initialize Database

```bash
npm run init-db
```

This will:
- Create the database schema
- Create two hardcoded admin users:
  - Username: `admin`, Password: `admin123`
  - Username: `moderator`, Password: `moderator123`
- Add sample games and news articles

⚠️ **IMPORTANT**: Change these credentials immediately!

### 4. Start the Server

```bash
npm run dev
```

or for production:

```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

#### Register (Admin Only)
```
POST /api/auth/register
Body: { "username": "newuser", "password": "password123" }
```

#### Login
```
POST /api/auth/login
Body: { "username": "admin", "password": "admin123" }
Response: { "token": "...", "user": { "id": 1, "username": "admin", "isAdmin": true } }
```

### Games

#### Get All Games
```
GET /api/games
```

#### Get Single Game
```
GET /api/games/:id
```

#### Create Game (Admin Only)
```
POST /api/games
Headers: Authorization: Bearer <token>
Body: {
  "title": "Quiz Master",
  "description": "Test your knowledge",
  "category": "Quiz",
  "difficulty": "Easy"
}
```

#### Update Game (Admin Only)
```
PUT /api/games/:id
Headers: Authorization: Bearer <token>
Body: { "title": "...", "description": "...", "category": "...", "difficulty": "..." }
```

#### Delete Game (Admin Only)
```
DELETE /api/games/:id
Headers: Authorization: Bearer <token>
```

### News

#### Get All News
```
GET /api/news
```

#### Get Single News Article
```
GET /api/news/:id
```

#### Create News (Admin Only)
```
POST /api/news
Headers: Authorization: Bearer <token>
Body: {
  "title": "Breaking News",
  "content": "Article content here...",
  "category": "Announcement"
}
```

#### Update News (Admin Only)
```
PUT /api/news/:id
Headers: Authorization: Bearer <token>
Body: { "title": "...", "content": "...", "category": "..." }
``

#### Delete News (Admin Only)
```
DELETE /api/news/:id
Headers: Authorization: Bearer <token>
```

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `password`: Hashed password (bcryptjs)
- `is_admin`: Boolean flag for admin access
- `created_at`: Timestamp

### Games Table
- `id`: Primary key
- `title`: Game title
- `description`: Game description
- `category`: Game category
- `difficulty`: Difficulty level
- `created_by`: Foreign key to users
- `created_at`: Timestamp
- `updated_at`: Timestamp

### News Table
- `id`: Primary key
- `title`: Article title
- `content`: Article content
- `author_id`: Foreign key to users
- `category`: Article category
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Adding More Admin Users

Edit `ADMIN_USERS` array in `src/auth.js`:

```javascript
const ADMIN_USERS = ['admin', 'moderator', 'your_new_username'];
```

Then users can register themselves if their username is in this list.

## Security Notes

⚠️ For production:
1. Change `JWT_SECRET` to a strong random string
2. Change default admin passwords immediately
3. Set `NODE_ENV=production`
4. Use environment variables for sensitive data
5. Add rate limiting
6. Add input validation
7. Use HTTPS

## Development

The server uses `nodemon` for auto-reload during development. Any changes to files will automatically restart the server.

```bash
npm run dev
```

## File Structure

```
backend/
├── src/
│   ├── index.js          # Main server file
│   ├── db.js             # Database utilities
│   ├── auth.js           # Authentication utilities
│   └── routes/
│       ├── auth.js       # Authentication routes
│       ├── games.js      # Games routes
│       └── news.js       # News routes
├── scripts/
│   └── initDb.js         # Database initialization script
├── data/
│   └── flinc.db          # SQLite database (created on init)
├── package.json
└── README.md
```

## Troubleshooting

### Port Already in Use
Change `PORT` in `.env` file and restart

### Database Lock Issues
Delete `backend/data/flinc.db` and run `npm run init-db` again

### Authentication Errors
Ensure token is included in `Authorization` header as: `Bearer <token>`

## Next Steps

1. Connect the Vue frontend to these API endpoints
2. Update default credentials
3. Add more validation and error handling
4. Consider adding more tables for game scores, user profiles, etc.

