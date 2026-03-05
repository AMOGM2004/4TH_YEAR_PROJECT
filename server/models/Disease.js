const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cropType: { type: String },
  imageUrl: { type: String },
  prediction: { type: String },
  confidence: { type: Number },
  treatment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Disease', diseaseSchema);