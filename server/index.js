const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const CropRoutes = require('./routes/CropRoutes');
const mlRoutes = require('./routes/mlRoutes');
const fertilizerRoutes = require('./routes/fertilizerRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const path = require('path');


require('dotenv').config();

const connectDB = require('./config/db'); 
const app = express();

connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/crop', CropRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/fertilizer', fertilizerRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/test-db', (req, res) => {
  res.json({ message: 'Database connected successfully' });
});

// Test route
app.get('/', (req, res) => {
  res.send('Crop Recommendation API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
