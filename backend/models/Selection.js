const mongoose = require('mongoose');

const selectionSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  team_id: { type: String, required: true },
  ps_id: { type: String, required: true },
  idea: { type: String, required: true },
  ppt_generated: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Selection', selectionSchema);