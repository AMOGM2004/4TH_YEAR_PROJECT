const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Nitrogen', 'Phosphorus', 'Potassium', 'Mixed'] },
  npk_ratio: { 
    N: { type: Number }, // Percentage
    P: { type: Number },
    K: { type: Number }
  },
  price_per_kg: { type: Number },
  suitable_crops: [{ type: String }]
});

module.exports = mongoose.model('Fertilizer', fertilizerSchema);