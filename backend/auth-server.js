require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'varuntejreddy03@gmail.com',
    pass: 'mesk ndce leev mltg'
  }
});

// Initialize database
const db = new sqlite3.Database('selections.db');

db.serialize(() => {
  // Teams table with authentication
  db.run(`CREATE TABLE IF NOT EXISTS teams (
    team_id TEXT PRIMARY KEY,
    team_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    members TEXT NOT NULL,
    password TEXT NOT NULL,
    is_logged_in BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL
  )`);

  // Admin users table
  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);

  // Create default admin user
  db.run(
    'INSERT OR IGNORE INTO admin_users (username, password, email, created_at) VALUES (?, ?, ?, ?)',
    ['admin', 'admin123', 'varuntejreddy03@gmail.com', new Date().toISOString()]
  );
});

// Generate random password
function generatePassword() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Send email with password
async function sendPasswordEmail(email, teamId, password) {
  const mailOptions = {
    from: 'varuntejreddy03@gmail.com',
    to: email,
    subject: 'SIH 2025 Team Registration - Login Credentials',
    html: `
      <h2>Welcome to SIH 2025 Platform!</h2>
      <p>Your team <strong>${teamId}</strong> has been successfully registered.</p>
      <p><strong>Login Credentials:</strong></p>
      <p>Team ID: <strong>${teamId}</strong></p>
      <p>Password: <strong>${password}</strong></p>
      <p>Please use these credentials to login and access the problem browser.</p>
      <p>Best of luck for SIH 2025!</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
}

// Team registration endpoint
app.post('/api/register_team', async (req, res) => {
  const { team_id, team_name, contact_email, members } = req.body;
  
  // Validate minimum 3 members
  const validMembers = members.filter(m => m.trim() !== '');
  if (validMembers.length < 3) {
    return res.status(400).json({ error: 'Minimum 3 members required' });
  }
  
  const password = generatePassword();
  
  try {
    // Insert team into database
    db.run(
      'INSERT OR REPLACE INTO teams (team_id, team_name, contact_email, members, password, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [team_id, team_name, contact_email, JSON.stringify(validMembers), password, new Date().toISOString()],
      async function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        try {
          // Send password email
          await sendPasswordEmail(contact_email, team_id, password);
          res.json({ 
            success: true, 
            message: 'Team registered successfully! Password sent to email.' 
          });
        } catch (emailError) {
          console.error('Email error:', emailError);
          res.json({ 
            success: true, 
            message: `Team registered successfully! Password: ${password}`,
            password: password
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Team login endpoint
app.post('/api/login', (req, res) => {
  const { team_id, password } = req.body;
  
  db.get('SELECT * FROM teams WHERE team_id = ? AND password = ?', [team_id, password], (err, team) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (!team) {
      return res.status(401).json({ error: 'Invalid team ID or password' });
    }
    
    // Update login status
    db.run('UPDATE teams SET is_logged_in = 1 WHERE team_id = ?', [team_id]);
    
    res.json({ 
      success: true, 
      team: {
        team_id: team.team_id,
        team_name: team.team_name,
        contact_email: team.contact_email,
        members: JSON.parse(team.members)
      }
    });
  });
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM admin_users WHERE username = ? AND password = ?', [username, password], (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    res.json({ 
      success: true, 
      admin: {
        username: admin.username,
        email: admin.email
      }
    });
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const { team_id } = req.body;
  
  db.run('UPDATE teams SET is_logged_in = 0 WHERE team_id = ?', [team_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`✅ SIH Auth Server running on http://localhost:${PORT}`);
  console.log('📧 Email: Password delivery system active');
  console.log('🔐 Auth: Team login system enabled');
  console.log('👑 Admin: admin/admin123 credentials ready');
});