const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  N: { type: Number, required: true },
  P: { type: Number, required: true },
  K: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  ph: { type: Number, required: true },
  rainfall: { type: Number, required: true },
  label: { type: String, required: true } // Crop name
});

module.exports = mongoose.model('Crop', cropSchema);