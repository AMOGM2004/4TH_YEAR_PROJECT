import React, { useState } from 'react';
import {
  Container, Paper, Typography, Button, Box,
  Grid, Card, CardContent, Chip, Divider,
  CircularProgress, Alert, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import {
  CloudUpload, BugReport, History,
  CheckCircle, Cancel, Visibility
} from '@mui/icons-material';
import axios from 'axios';

const Disease = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropType, setCropType] = useState('rice');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const crops = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'maize', label: 'Maize' },
    { value: 'tomato', label: 'Tomato' },
    { value: 'potato', label: 'Potato' }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('cropType', cropType);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/disease/detect',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setResult(response.data);
    } catch (error) {
      alert('Error detecting disease: ' + error.message);
    }
    setLoading(false);
  };

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/disease/history',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const getSeverityColor = (disease) => {
    if (disease === 'Healthy') return 'success';
    if (disease.includes('Unknown')) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReport /> Crop Disease Detection
      </Typography>
      <Typography color="text.secondary" paragraph>
        Upload leaf image to detect diseases using AI
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Upload & Detection */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUpload /> Upload Leaf Image
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Crop Type</InputLabel>
                  <Select
                    value={cropType}
                    label="Select Crop Type"
                    onChange={(e) => setCropType(e.target.value)}
                  >
                    {crops.map((crop) => (
                      <MenuItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: '#fafafa',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#2E7D32' }
                  }}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  {preview ? (
                    <Box>
                      <img
                        src={preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                      />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Click to change image
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 60, color: '#BDBDBD', mb: 2 }} />
                      <Typography>Click to upload leaf image</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supports JPG, PNG (Max 5MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleDetect}
                  disabled={loading || !selectedFile}
                  startIcon={loading ? <CircularProgress size={20} /> : <BugReport />}
                  sx={{ bgcolor: '#2E7D32', py: 1.5 }}
                >
                  {loading ? 'Analyzing Image...' : 'Detect Disease'}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Detection Result */}
          {result && (
            <Paper sx={{ p: 3, mt: 3, bgcolor: '#FFF3E0' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BugReport /> Detection Result
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={result.prediction}
                      color={getSeverityColor(result.prediction)}
                      size="medium"
                      icon={result.prediction === 'Healthy' ? <CheckCircle /> : <Cancel />}
                    />
                    <Chip
                      label={`Confidence: ${(result.confidence * 100).toFixed(1)}%`}
                      variant="outlined"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ bgcolor: '#F5F5F5' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        💡 Treatment Recommendation
                      </Typography>
                      <Typography variant="body1">
                        {result.treatment}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {result.imageUrl && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Visibility />
                      <Typography variant="body2">
                        Image uploaded: {result.imageUrl.split('/').pop()}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Right Column - History & Info */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <History /> Detection History
              </Typography>
              <Button size="small" onClick={loadHistory} startIcon={<History />}>
                Refresh
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {history.length > 0 ? (
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {history.map((item, index) => (
                  <Card key={index} sx={{ mb: 2, bgcolor: '#F9F9F9' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            {item.cropType} • {new Date(item.createdAt).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={item.prediction}
                            color={getSeverityColor(item.prediction)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Typography variant="caption">
                          {(item.confidence * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <History sx={{ fontSize: 48, color: '#E0E0E0', mb: 2 }} />
                <Typography color="text.secondary">
                  No detection history yet
                </Typography>
                <Typography variant="caption">
                  Upload images to see history here
                </Typography>
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Tip:</strong> For best results, upload clear images of leaves against a plain background.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Disease;