const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Disease = require('../models/Disease');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/disease-images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  }
});

// Disease detection endpoint
router.post('/detect', upload.single('image'), async (req, res) => {
  try {
    const { cropType } = req.body;
    const imagePath = req.file.path;

    // Mock AI prediction (replace with actual CNN model)
    const diseases = {
      'rice': ['Bacterial Blight', 'Blast', 'Brown Spot', 'Healthy'],
      'wheat': ['Rust', 'Smut', 'Blight', 'Healthy'],
      'maize': ['Blight', 'Rust', 'Gray Leaf Spot', 'Healthy']
    };

    const cropDiseases = diseases[cropType] || ['Unknown Disease', 'Healthy'];
    const prediction = cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
    const confidence = (Math.random() * 0.3 + 0.7).toFixed(2); // 70-100%

    // Treatment suggestions
    const treatments = {
      'Bacterial Blight': 'Apply Streptomycin sulfate or Copper-based fungicides',
      'Blast': 'Use Tricyclazole or Carbendazim fungicides',
      'Brown Spot': 'Apply Mancozeb or Chlorothalonil',
      'Rust': 'Use Propiconazole or Tebuconazole',
      'Healthy': 'No treatment needed. Plant is healthy.',
      'Unknown Disease': 'Consult agricultural officer for diagnosis'
    };

    // Save to database
    const diseaseRecord = new Disease({
      farmerId: req.user?._id,
      cropType,
      imageUrl: `/uploads/${req.file.filename}`,
      prediction,
      confidence,
      treatment: treatments[prediction] || 'Consult local agriculture department'
    });

    await diseaseRecord.save();

    res.json({
      success: true,
      prediction,
      confidence,
      treatment: diseaseRecord.treatment,
      imageUrl: diseaseRecord.imageUrl,
      timestamp: new Date().toLocaleString()
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detection history
router.get('/history', async (req, res) => {
  try {
    const history = await Disease.find({ farmerId: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;