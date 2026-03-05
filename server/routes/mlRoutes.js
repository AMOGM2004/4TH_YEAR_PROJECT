const express = require('express');
const router = express.Router();
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');


const allCrops = ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans',
                  'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 
                  'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 
                  'coconut', 'cotton', 'jute', 'coffee'];


router.post('/predict', async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
    
    // Simple rule-based prediction
    let prediction = 'rice';
    let confidence = 0.85;
    
    if (temperature < 18) prediction = 'wheat';
    else if (temperature > 30) prediction = 'cotton';
    else if (rainfall > 250) prediction = 'rice';
    else if (rainfall < 100) prediction = 'wheat';
    else if (N > 100 && K > 50) prediction = 'maize';
    
    res.json({
      success: true,    
      crop: prediction,
      confidence: confidence,
      scientific_name: getScientificName(prediction),
      method: 'rule-based'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});


router.post('/predict-real', (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
    
  
    if (!N || !P || !K || !temperature || !humidity || !ph || !rainfall) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Prepare input data for Python
    const inputData = {
      N: parseFloat(N),
      P: parseFloat(P),
      K: parseFloat(K),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall)
    };
    
    // Spawn Python process
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../ml-model/predict.py'),
      JSON.stringify(inputData)
    ]);
    
    let stdoutData = '';
    let stderrData = '';
    
  
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
   
    pythonProcess.on('close', (code) => {
      if (code === 0 && stdoutData) {
        try {
          const result = JSON.parse(stdoutData);
          
          // Validate result
          if (!result.crop || !allCrops.includes(result.crop.toLowerCase())) {
            throw new Error('Invalid crop prediction');
          }
          
          res.json({
            success: true,
            crop: result.crop,
            confidence: result.confidence || 0.85,
            all_probabilities: result.all_probabilities || [],
            method: 'ai-ml',
            model: 'kaggle-22-crops'
          });
          
        } catch (parseError) {
          console.error('Parse error:', parseError, 'Raw:', stdoutData);
          res.status(500).json({
            success: false,
            error: 'Failed to parse ML response',
            raw: stdoutData,
            stderr: stderrData
          });
        }
      } else {
        console.error('Python error:', stderrData);
      
        const fallbackCrop = allCrops[Math.floor(Math.random() * allCrops.length)];
        res.json({
          success: true,
          crop: fallbackCrop,
          confidence: 0.65,
          method: 'fallback-random',
          error: stderrData || 'Python process failed'
        });
      }
    });
    
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


router.get('/crops', (req, res) => {
  res.json({
    success: true,
    count: allCrops.length,
    crops: allCrops,
    source: 'Kaggle Crop Recommendation Dataset'
  });
});


function getScientificName(crop) {
  const names = {
    'rice': 'Oryza sativa',
    'wheat': 'Triticum aestivum',
    'maize': 'Zea mays',
    'cotton': 'Gossypium hirsutum',
    'sugarcane': 'Saccharum officinarum',
    'apple': 'Malus domestica',
    'banana': 'Musa acuminata',
    'mango': 'Mangifera indica',
    'grapes': 'Vitis vinifera',
    'watermelon': 'Citrullus lanatus',
    'orange': 'Citrus × sinensis',
    'papaya': 'Carica papaya',
    'coconut': 'Cocos nucifera',
    'coffee': 'Coffea arabica'
  };
  return names[crop.toLowerCase()] || 'Scientific name not available';
}

module.exports = router;