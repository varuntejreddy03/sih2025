require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Team = require('./models/Team');
const Selection = require('./models/Selection');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate random password
function generatePassword() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Send email with password
async function sendPasswordEmail(email, teamId, password) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
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
  
  console.log('Registration request:', { team_id, team_name, contact_email, members });
  
  const validMembers = members.filter(m => m && m.trim() !== '');
  if (validMembers.length < 6) {
    return res.status(400).json({ error: 'Minimum 6 members required' });
  }
  
  const password = generatePassword();
  
  try {
    // Check if team already exists
    const existingTeam = await Team.findOne({ team_id });
    if (existingTeam) {
      return res.status(400).json({ error: 'Team ID already exists' });
    }
    
    const team = new Team({
      team_id,
      team_name,
      contact_email,
      members: validMembers,
      password
    });
    
    const savedTeam = await team.save();
    console.log('Team saved:', savedTeam);
    
    try {
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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Team login endpoint
app.post('/api/login', async (req, res) => {
  const { team_id, password } = req.body;
  
  try {
    const team = await Team.findOne({ team_id, password });
    
    if (!team) {
      return res.status(401).json({ error: 'Invalid team ID or password' });
    }
    
    team.is_logged_in = true;
    await team.save();
    
    res.json({ 
      success: true, 
      team_id: team.team_id,
      team_name: team.team_name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team profile
app.get('/api/team/profile/:team_id', async (req, res) => {
  try {
    const team = await Team.findOne({ team_id: req.params.team_id });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json({
      team_id: team.team_id,
      team_name: team.team_name,
      contact_email: team.contact_email,
      members: team.members,
      created_at: team.created_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login endpoint
app.post('/api/admin_login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// Logout endpoint
app.post('/api/logout', async (req, res) => {
  const { team_id } = req.body;
  
  try {
    await Team.updateOne({ team_id }, { is_logged_in: false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Problems data (static for now)
const problems = [
  {
    ps_id: "SIH001",
    title: "Smart Traffic Management System",
    theme: "Smart Automation",
    category: "Software",
    description: "Develop an AI-powered traffic management system to reduce congestion in urban areas."
  },
  {
    ps_id: "SIH002", 
    title: "Digital Health Monitoring Platform",
    theme: "Healthcare & Biomedical Devices",
    category: "Software",
    description: "Create a comprehensive digital platform for remote health monitoring and telemedicine."
  },
  {
    ps_id: "SIH003",
    title: "Rural Education Enhancement System",
    theme: "Miscellaneous",
    category: "Software",
    description: "Develop a digital platform to enhance education delivery in rural areas."
  },
  {
    ps_id: "SIH004",
    title: "Agricultural Crop Monitoring",
    theme: "Agriculture, FoodTech & Rural Development",
    category: "Software",
    description: "Create an IoT-based system for real-time crop monitoring and yield prediction."
  },
  {
    ps_id: "SIH005",
    title: "Smart Waste Management",
    theme: "Clean & Green Technology",
    category: "Software",
    description: "Develop an intelligent waste collection and recycling management system."
  }
];

app.get('/api/problems', (req, res) => {
  res.json(problems);
});

// Save selection
app.post('/api/save_selection', async (req, res) => {
  const { student_name, team_id, ps_id, idea } = req.body;
  
  console.log('Save selection request:', { student_name, team_id, ps_id, idea });
  
  try {
    const selection = new Selection({
      student_name: student_name || 'Team Member',
      team_id,
      ps_id,
      idea: idea || 'Generated solution'
    });
    
    const savedSelection = await selection.save();
    console.log('Selection saved:', savedSelection);
    res.json({ success: true });
  } catch (error) {
    console.error('Save selection error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard (team's selections only)
app.get('/api/dashboard/:team_id', async (req, res) => {
  try {
    console.log('Getting dashboard for team:', req.params.team_id);
    const selections = await Selection.find({ team_id: req.params.team_id });
    console.log('Found selections:', selections);
    
    const dashboard = selections.map(selection => ({
      student_name: selection.student_name,
      team_id: selection.team_id,
      ps_id: selection.ps_id,
      ps_title: problems.find(p => p.ps_id === selection.ps_id)?.title || 'Unknown Problem',
      status: 'Submitted'
    }));
    res.json(dashboard);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate PPT (simplified)
app.post('/generate_ppt', async (req, res) => {
  const { ps_id, title, team_id, idea, student_name } = req.body;
  
  try {
    const scores = { novelty: 9, feasibility: 9, impact: 9 };
    
    res.json({
      success: true,
      message: 'SIH Content generated successfully!',
      scores: scores
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download PPT
app.post('/download_ppt', (req, res) => {
  const { ps_id, team_id, title } = req.body;
  
  let pptContent = `# SIH 2025 Content Pack\n\n`;
  pptContent += `Problem Statement: ${title}\n`;
  pptContent += `PS ID: ${ps_id}\n`;
  pptContent += `Team: ${team_id}\n\n`;
  pptContent += `Generated content for SIH 2025 presentation...`;
  
  const filename = `SIH2025_Content_${team_id}_${ps_id}.txt`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(pptContent);
});

app.listen(PORT, () => {
  console.log(`✅ SIH Platform with MongoDB running on http://localhost:${PORT}`);
});