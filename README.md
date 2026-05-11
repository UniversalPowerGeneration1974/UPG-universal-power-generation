# UPG Universal Power Generation - Full Stack Web Application

A modern solar energy company web application with user authentication, real-time messaging, and profile management. Built with Node.js/Express backend and vanilla JavaScript frontend with yellow and blue color scheme.

## Features

- 🔐 **User Authentication**: Secure login and signup with JWT
- 💬 **Real-time Chat**: Direct messaging between users
- 👤 **User Profiles**: Customizable user profiles with company info
- 🌞 **Solar Focus**: Beautiful hero page showcasing solar energy solutions
- 🎨 **Modern UI**: Yellow and blue color scheme throughout
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
UPG 2/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   └── upg.db (created on first run)
└── frontend/
    ├── index.html
    ├── styles.css
    ├── app.js
    └── README.md
```

## Backend Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with default values. You can modify it if needed:
```
PORT=5000
JWT_SECRET=upg_universal_power_generation_secret_key_2026
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

or for development with auto-reload:
```bash
npm install -g nodemon
npm run dev
```

The backend will run on `http://localhost:5000`

### API Endpoints

**Authentication:**
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to account

**Users:**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (requires auth)

**Messages:**
- `POST /api/messages` - Send message (requires auth)
- `GET /api/messages/:userId` - Get messages with user (requires auth)

## Frontend Setup (React)

### Prerequisites
- Node.js v14+ installed

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Usage

### First Time Setup

1. Start the backend server (port 5000)
2. Start the frontend server (port 8000)
3. Open frontend in browser
4. Click "Sign Up" to create an account
5. Enter credentials and create account
6. You'll be logged in automatically

### Features

**Home Page:**
- Welcome message
- Company information
- Features overview

**Sign Up:**
- Create new account
- Required: Full name, username, email, password

**Login:**
- Sign in with email and password
- JWT token automatically stored

**Chat:**
- View all registered users
- Send and receive messages
- Real-time message display
- Auto-refresh every 5 seconds

**Profile:**
- View your information
- Edit name, phone, company, location
- Avatar with initials

## API Response Examples

### Signup Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "John Doe"
  }
}
```

### Login Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "John Doe",
    "avatar": null
  }
}
```

## Color Scheme

- **Primary Blue**: #1e3a8a (Navy Blue)
- **Secondary Blue**: #0369a1 (Cyan Blue)
- **Primary Yellow**: #fbbf24 (Golden Yellow)
- **Light Yellow**: #fef3c7 (Pale Yellow)
- **Light Blue**: #dbeafe (Sky Blue)

## Database

The application uses SQLite for data storage. Database is automatically created on first run.

**Tables:**
- `users` - User accounts and profiles
- `messages` - Chat messages between users

## Security Notes

- Passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- Authentication required for profile updates and messaging
- Change JWT_SECRET in production

## Troubleshooting

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check if CORS is enabled (it is by default)
- Verify API_BASE_URL in app.js points to correct backend URL

**Database issues:**
- Delete `upg.db` file and restart server to recreate
- Ensure write permissions in backend directory

**Messages not appearing:**
- Check browser console for errors
- Verify both users are created
- Try refreshing the page

## Future Enhancements

- Real-time WebSocket messaging
- File sharing
- Group chats
- Admin dashboard
- Solar calculator tool
- Payment integration
- Email notifications

## License

MIT License - Feel free to use this project for learning purposes

## Support

For issues or questions, please check the troubleshooting section or review the code comments.
