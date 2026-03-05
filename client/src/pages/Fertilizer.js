import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField,
  Button, Grid, Box, Card, CardContent,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Divider, Slider
} from '@mui/material';
import { Calculate, Grass, Paid, Science } from '@mui/icons-material';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';



const Fertilizer = () => {
  const [formData, setFormData] = useState({
    crop: 'rice',
    N: 40, P: 20, K: 30,
    area: 1
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
   

  const crops = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'maize', label: 'Maize' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'sugarcane', label: 'Sugarcane' }
  ];
const { t } = useLanguage(); 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/fertilizer/calculate',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (error) {
      alert('Error calculating fertilizer');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Calculate />{t('fertilizerCalculator')}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t('calculateFertilizer')}
      </Typography>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Grass /> {t('soil&cropDetails')}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label={t('selectCrop')}
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                >
                  {crops.map((crop) => (
                    <option key={crop.value} value={crop.value}>
                      {crop.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              {[t('N'), t('P'), t('K') ].map((nutrient) => (
                <Grid item xs={12} sm={4} key={nutrient}>
                  <Box>
                    <Typography gutterBottom>
                      {nutrient} ({t('kg/ha')})
                    </Typography>
                    <Slider
                      value={formData[nutrient]}
                      onChange={(e, val) => setFormData({ ...formData, [nutrient]: val })}
                      min={0}
                      max={150}
                      step={5}
                      sx={{ color: '#2E7D32' }}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      name={nutrient}
                      value={formData[nutrient]}
                      onChange={handleChange}
                      size="small"
                    />
                  </Box>
                </Grid>
              ))}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('farmArea') + ' (' + t('acre') + ')'}
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCalculate}
                  disabled={loading}
                  startIcon={<Calculate />}
                  sx={{ bgcolor: '#2E7D32', py: 1.5 }}
                >
                  {loading ? t('calculating') : t('calculateFertilizerRequirements')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#F9F9F9' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Science /> {t('fertilizerRecommendations')}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {result ? (
              <Box>
                {/* Deficiency Display */}
                <Card sx={{ mb: 3, bgcolor: '#FFF3E0' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                     
                      {t('nutrientDeficiency') + ' (' + t('kg/acre') + ')'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      {Object.entries(result.deficiency).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value} kg`}
                          color={value > 0 ? "error" : "success"}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Recommendations Table */}
                {result.recommendations.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#E8F5E9' }}>
                          <TableCell>{t('fertilizer')}</TableCell>
                          <TableCell align="right">{t('quantity')} ({t('kg')})</TableCell>
                          <TableCell align="right">{t('fertilizerCost')} (₹)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.recommendations.map((rec, index) => (
                          <TableRow key={index}>
                            <TableCell>{rec.fertilizer}</TableCell>
                            <TableCell align="right">{rec.quantity}</TableCell>
                            <TableCell align="right">{rec.cost}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="success.main" sx={{ py: 4, textAlign: 'center' }}>
                    ✅ No fertilizer needed! Soil nutrients are sufficient.
                  </Typography>
                )}

                {/* Total Cost */}
                {result.total_cost > 0 && (
                  <Card sx={{ mt: 3, bgcolor: '#E8F5E9' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Paid /> {t('totalCost')}
                        </Typography>
                        <Typography variant="h4" color="#2E7D32">
                          ₹{result.total_cost}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        For {result.area} acre of {result.crop}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            ) : (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Calculate sx={{ fontSize: 60, color: '#BDBDBD', mb: 2 }} />
                <Typography color="text.secondary">
                 
                  {t('enterCropDetails')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Fertilizer;