# UPG Universal Power Generation - Complete Setup Guide

## 🌞 Overview

Full-stack solar energy company web application with:
- **Frontend**: React 18 with JSX components
- **Backend**: Node.js/Express with SQLite
- **Theme**: Yellow & Blue color scheme

## 📋 Prerequisites

- **Node.js** v14 or higher ([Download](https://nodejs.org))
- **npm** v6 or higher (comes with Node.js)

## 🚀 Quick Start (5 minutes)

### Terminal 1 - Backend Setup

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start server
npm start
```

✅ Backend running at `http://localhost:5000`

### Terminal 2 - Frontend Setup

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

✅ Frontend running at `http://localhost:3000`

## 📁 Project Structure

```
UPG 2/
├── backend/
│   ├── server.js                 # Express server & API
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables
│   └── upg.db                    # SQLite database (auto-created)
│
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML entry point
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── pages/                # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── *.css
│   │   ├── config/
│   │   │   └── api.js            # Axios configuration
│   │   ├── App.jsx               # Main App component
│   │   └── index.js              # React entry point
│   ├── package.json              # Frontend dependencies
│   └── .env                      # Environment variables
│
├── README.md                     # This file
├── QUICK_START.md               # Quick setup guide
└── .gitignore                   # Git ignore rules
```

## 🔧 Technology Stack

### Backend
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **cors** - Cross-origin support

### Frontend
- **React 18** - UI framework
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling with gradients & animations

## 🎨 Features

### Pages
1. **Login** - Secure user authentication
2. **Signup** - New account creation
3. **Home** - Welcome & features showcase
4. **Chat** - Real-time messaging between users
5. **Profile** - User information management

### Color Theme
| Element | Color |
|---------|-------|
| Primary Blue | #1e3a8a |
| Secondary Blue | #0369a1 |
| Primary Yellow | #fbbf24 |
| Light Yellow | #fef3c7 |
| Light Blue | #dbeafe |

## 📝 Usage Guide

### 1️⃣ Create Your Account

1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Fill in:
   - Full Name
   - Username (must be unique)
   - Email (must be unique)
   - Password
4. Click "Sign Up"

### 2️⃣ Login

1. Enter email and password
2. Click "Login"
3. Redirected to Home page

### 3️⃣ Update Profile

1. Click "Profile" in navbar
2. Edit your information:
   - Full Name
   - Phone
   - Company
   - Location
3. Click "Update Profile"

### 4️⃣ Chat with Users

1. Click "Chat" in navbar
2. Select a contact from the list
3. Type your message
4. Press Enter or click "Send"
5. Messages auto-refresh every 3 seconds

### 5️⃣ Logout

1. Click "Logout" in navbar
2. Redirected to login page

## 🔌 API Endpoints Reference

### Authentication

**POST /api/auth/signup**
```json
{
  "fullname": "John Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Users

**GET /api/users** - Get all users

**GET /api/users/:id** - Get user profile

**PUT /api/users/:id** - Update profile (requires auth)
```json
{
  "fullname": "John Doe",
  "phone": "1234567890",
  "company": "Solar Inc",
  "location": "USA"
}
```

### Messages

**POST /api/messages** - Send message (requires auth)
```json
{
  "receiver_id": 2,
  "message": "Hello!"
}
```

**GET /api/messages/:userId** - Get messages (requires auth)

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# If port is in use, kill the process
taskkill /PID <PID> /F
```

### Frontend won't start

```bash
# Clear node_modules and reinstall
cd frontend
rm -r node_modules
npm install
npm start
```

### Can't login/signup

1. Ensure backend is running on port 5000
2. Check browser console for errors (F12)
3. Verify `.env` files are correctly set

### Messages not loading

1. Refresh the page
2. Check backend is running
3. Verify both users are created
4. Check browser console for errors

### Port conflicts

```bash
# Find process using port
# Windows
netstat -ano | findstr :<PORT>
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :<PORT>
kill -9 <PID>
```

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "dotenv": "^16.0.3",
  "sqlite3": "^5.1.6"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.0"
}
```

## 🔐 Security Notes

- Passwords are hashed with bcryptjs (10 rounds)
- JWT tokens expire after 7 days
- CORS enabled for frontend communication
- Token automatically included in API requests

⚠️ **For Production:**
- Change JWT_SECRET in `.env`
- Use HTTPS instead of HTTP
- Implement rate limiting
- Add input validation & sanitization

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [React Router](https://reactrouter.com)
- [SQLite Documentation](https://www.sqlite.org)

## 🤝 Development Tips

1. Use React Developer Tools browser extension
2. Use console.log for debugging
3. Check Network tab for API calls
4. Keep .env files secure
5. Test API endpoints with Postman/Insomnia

## 📄 License

MIT License - Free to use and modify

## 💬 Support

For issues or questions:
1. Check troubleshooting section
2. Review code comments
3. Check browser console (F12)
4. Verify all prerequisites are installed

---

**Made with 💛💙 for sustainable energy** ☀️
