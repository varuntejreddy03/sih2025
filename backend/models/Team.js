const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  team_id: { type: String, required: true, unique: true },
  team_name: { type: String, required: true },
  contact_email: { type: String, required: true },
  members: [{ type: String, required: true }],
  password: { type: String, required: true },
  is_logged_in: { type: Boolean, default: false },
  is_default_password: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);