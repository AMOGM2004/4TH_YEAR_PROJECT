const express = require('express');
const router = express.Router();
const Fertilizer = require('../models/Fertilizer');

// Calculate fertilizer requirement
router.post('/calculate', async (req, res) => {
  try {
    const { crop, N, P, K, area } = req.body;
    
    // Crop nutrient requirements (kg/acre)
    const cropRequirements = {
      'rice': { N: 120, P: 60, K: 60 },
      'wheat': { N: 100, P: 50, K: 50 },
      'maize': { N: 130, P: 60, K: 60 },
      'cotton': { N: 80, P: 40, K: 40 }
    };
    
    const requirements = cropRequirements[crop] || { N: 100, P: 50, K: 50 };
    
    // Calculate deficiency
    const deficiency = {
      N: Math.max(0, requirements.N - N),
      P: Math.max(0, requirements.P - P),
      K: Math.max(0, requirements.K - K)
    };
    
    // Recommend fertilizers
    const recommendations = [];
    
    if (deficiency.N > 0) {
      recommendations.push({
        fertilizer: 'Urea',
        quantity: (deficiency.N / 0.46).toFixed(2), // Urea has 46% N
        cost: ((deficiency.N / 0.46) * 12).toFixed(2) // ₹12 per kg
      });
    }
    
    if (deficiency.P > 0) {
      recommendations.push({
        fertilizer: 'DAP',
        quantity: (deficiency.P / 0.46).toFixed(2), // DAP has 46% P2O5
        cost: ((deficiency.P / 0.46) * 35).toFixed(2) // ₹35 per kg
      });
    }
    
    if (deficiency.K > 0) {
      recommendations.push({
        fertilizer: 'MOP',
        quantity: (deficiency.K / 0.60).toFixed(2), // MOP has 60% K2O
        cost: ((deficiency.K / 0.60) * 25).toFixed(2) // ₹25 per kg
      });
    }
    
    res.json({
      success: true,
      crop,
      area,
      deficiency,
      recommendations,
      total_cost: recommendations.reduce((sum, rec) => sum + parseFloat(rec.cost), 0).toFixed(2)
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;