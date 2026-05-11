# UPG React Frontend - Setup Guide

## Features

✅ React 18 with Hooks  
✅ React Router v6 for navigation  
✅ Axios for API calls  
✅ Responsive CSS with Yellow & Blue theme  
✅ Component-based architecture  

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Home.jsx
│   │   ├── Chat.jsx
│   │   ├── Profile.jsx
│   │   ├── Auth.css
│   │   ├── Home.css
│   │   ├── Chat.css
│   │   └── Profile.css
│   ├── config/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── .env
```

## Installation & Setup

### Prerequisites
- Node.js 14+ installed
- Backend running on port 5000

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

Edit `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

```bash
# Start development server with hot reload
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (use with caution)
npm eject
```

## Components Overview

### Navbar Component
- Navigation links (Home, Chat, Profile)
- Logout button
- Sticky positioning
- Responsive design

### Login Page
- Email and password input
- JWT token handling
- Link to signup
- Error messages

### Signup Page
- Full name, username, email, password inputs
- Account creation
- Auto-login after signup
- Link to login

### Home Page
- Welcome message
- Solar company information
- Features showcase with cards
- Responsive grid layout

### Chat Page
- Contact list sidebar
- Message display
- Real-time messaging
- Auto-refresh messages every 3 seconds
- Keyboard shortcuts (Enter to send)

### Profile Page
- User avatar with initials
- Editable profile fields
- Update functionality
- Read-only email and username

## Styling

### Color Scheme
- **Primary Blue**: #1e3a8a
- **Secondary Blue**: #0369a1
- **Yellow**: #fbbf24
- **Light Yellow**: #fef3c7
- **Light Blue**: #dbeafe

### CSS Features
- Gradient backgrounds
- Smooth animations
- Hover effects
- Responsive media queries
- Custom scrollbars

## API Integration

All API calls are managed through `config/api.js` with automatic token injection:

```javascript
// API instance with auth interceptor
export const api = axios.create({
    baseURL: API_BASE_URL
});
```

## Routing

Using React Router v6:
- `/` - Login (if not authenticated) or Home (if authenticated)
- `/signup` - Signup page
- `/chat` - Chat page (protected)
- `/profile` - Profile page (protected)

## State Management

Using React Hooks:
- `useState` - Local component state
- `useEffect` - Side effects and data fetching
- `useRef` - DOM references (scroll to bottom)
- `useNavigate` - Page navigation

## Troubleshooting

**Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Backend connection issues:**
- Ensure backend is running on port 5000
- Check `.env` REACT_APP_API_URL
- Clear browser cache and localStorage

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

Deploy to any static hosting service (Vercel, Netlify, etc).

## Notes

- React is configured for development with strict mode enabled
- All components use functional components with hooks
- CORS is enabled on backend for frontend communication
- Messages auto-refresh every 3-5 seconds
