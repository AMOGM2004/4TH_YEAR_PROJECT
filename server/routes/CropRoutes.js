const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Crop routes working' });
});



router.post('/predict', async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
    
  
    const input = [[N, P, K, temperature, humidity, ph, rainfall]];
    

    const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane','Apple' ];
    const randomCrop = crops[Math.floor(Math.random() * crops.length)];
    
    res.json({
      recommendation: randomCrop,
      confidence: (Math.random() * 0.3 + 0.7).toFixed(2) 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;