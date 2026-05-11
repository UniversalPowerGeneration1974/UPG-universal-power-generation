const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

// Database setup
const db = new sqlite3.Database('./upg.db', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullname TEXT,
    phone TEXT,
    company TEXT,
    location TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  )`);
});

// Authentication middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password, fullname } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, email, password, fullname) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, fullname || username],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'User already exists' });
        }
        
        const token = jwt.sign({ id: this.lastID, username, email }, JWT_SECRET, {
          expiresIn: '7d'
        });
        
        res.json({
          success: true,
          token,
          user: { id: this.lastID, username, email, fullname: fullname || username }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, {
        expiresIn: '7d'
      });

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          avatar: user.avatar
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Get profile
app.get('/api/users/:id', (req, res) => {
  db.get('SELECT id, username, email, fullname, phone, company, location, avatar FROM users WHERE id = ?', 
    [req.params.id], 
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    }
  );
});

// Update profile
app.put('/api/users/:id', verifyToken, (req, res) => {
  const { fullname, phone, company, location, avatar } = req.body;
  const userId = req.params.id;

  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updates = [];
  const values = [];

  if (fullname) { updates.push('fullname = ?'); values.push(fullname); }
  if (phone) { updates.push('phone = ?'); values.push(phone); }
  if (company) { updates.push('company = ?'); values.push(company); }
  if (location) { updates.push('location = ?'); values.push(location); }
  if (avatar) { updates.push('avatar = ?'); values.push(avatar); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(userId);
  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true, message: 'Profile updated' });
  });
});

// Get all users (for chat)
app.get('/api/users', (req, res) => {
  db.all('SELECT id, username, fullname, avatar FROM users', (err, users) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(users);
  });
});

// Send message
app.post('/api/messages', verifyToken, (req, res) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user.id;

  if (!receiver_id || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.run(
    'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [sender_id, receiver_id, message],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Get messages between two users
app.get('/api/messages/:userId', verifyToken, (req, res) => {
  const userId = req.params.userId;
  const currentUserId = req.user.id;

  db.all(
    `SELECT * FROM messages 
     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [currentUserId, userId, userId, currentUserId],
    (err, messages) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(messages);
    }
  );
});

app.listen(PORT, () => {
  console.log(`UPG Backend server running on http://localhost:${PORT}`);
});
