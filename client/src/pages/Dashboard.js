import React, { useState } from 'react';
import {
    Container, Grid, Card, CardContent, Typography, TextField,
    Button, Box, Avatar, Stack, Divider, Chip, Slider
} from '@mui/material';
import {
    Grass, Thermostat, WaterDrop, Phishing,
    Cloud, Agriculture, Science, Spa, Speed
} from '@mui/icons-material';
import axios from 'axios';
import '../components/Dashboard.css';
import { useLanguage } from '../contexts/LanguageContext';


const Dashboard = () => {
    const [soilData, setSoilData] = useState({
        N: 50, P: 40, K: 30,
        temperature: 25, humidity: 65,
        ph: 6.5, rainfall: 120
    });
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const { t } = useLanguage();

    const handleChange = (e) => {
        setSoilData({ ...soilData, [e.target.name]: e.target.value });
    };

    const handleSliderChange = (name, value) => {
        setSoilData({ ...soilData, [name]: value });
    };

    const getRecommendation = async () => {
        setLoading(true);
        try {

            const response = await axios.post('http://localhost:5000/api/ml/predict-real', soilData);

            if (response.data.success) {

              setRecommendation(response.data.crop); // ✅ Correct
                setConfidence(response.data.confidence);
            }
        } catch (error) {
            alert('Error getting recommendation');
        }
        setLoading(false);
    };

    const soilParams = [
       { icon: <Science />, label: t('nitrogen'), name: 'N', value: soilData.N, unit: 'kg/ha', min: 0, max: 140 },
    { icon: <Phishing />, label: t('phosphorus'), name: 'P', value: soilData.P, unit: 'kg/ha', min: 5, max: 145 },
    { icon: <Agriculture />, label: t('potassium'), name: 'K', value: soilData.K, unit: 'kg/ha', min: 5, max: 205 },
    { icon: <Thermostat />, label: t('temperature'), name: 'temperature', value: soilData.temperature, unit: '°C', min: 0, max: 50 },
    { icon: <WaterDrop />, label: t('humidity'), name: 'humidity', value: soilData.humidity, unit: '%', min: 10, max: 100 },
    { icon: <Spa />, label: t('phLevel'), name: 'ph', value: soilData.ph, unit: '', min: 3, max: 10, step: 0.1 },
    { icon: <Cloud />, label: t('rainfall'), name: 'rainfall', value: soilData.rainfall, unit: 'mm', min: 20, max: 300 },
    ]

    return (
        <Box className="dashboard-container">
            <Container maxWidth="xl">
                {/* Header */}
                <Card className="header-card" sx={{ mb: 4 }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: 'white', width: 56, height: 56 }}>
                                    <Grass sx={{ color: '#2E7D32', fontSize: 32 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">{t('smartCropAdvisor')}</Typography>
                                    <Typography variant="subtitle1" >  {t('aiPoweredPrecisionAgriculture')}</Typography>
                                </Box>
                            </Stack>
                            <Chip icon={<Speed />} label="Real-time Analysis" color="primary" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }} />
                        </Stack>
                    </CardContent>
                </Card>

                { }
                <Grid container spacing={3} alignItems="stretch">

                    <Grid item xs={12} lg={8}>
                        <Card className="param-card" sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2E7D32' }}>
                                    <Science fontSize="large" /> 
                                      {t('soil')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                   
                                      {t('adjust')}
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={3}>
                                    {soilParams.map((param) => (
                                        <Grid item xs={12} sm={6} md={4} key={param.name}>
                                            <Box sx={{ mb: 2 }}>
                                                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                                    <Box sx={{ color: '#4CAF50' }}>{param.icon}</Box>
                                                    <Typography variant="subtitle1" fontWeight="medium">{param.label}</Typography>
                                                </Stack>

                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    name={param.name}
                                                    value={param.value}
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        endAdornment: <Typography variant="caption">{param.unit}</Typography>,
                                                    }}
                                                    sx={{ mb: 1 }}
                                                />

                                                <Slider
                                                    value={Number(param.value)}
                                                    onChange={(e, val) => handleSliderChange(param.name, val)}
                                                    min={param.min}
                                                    max={param.max}
                                                    step={param.step || 1}
                                                    className="slider-track"
                                                    sx={{ color: '#4CAF50' }}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box sx={{ textAlign: 'center', mt: 4 }}>
                                    <Button
                                        className="analyze-btn"
                                        onClick={getRecommendation}
                                        disabled={loading}
                                        startIcon={<Grass />}
                                        size="large"
                                        variant="contained"
                                    >
                                     
                                        {loading ? t('analyzing') : t('getAIRecommendation')}
                                    </Button>


                                </Box>

                            </CardContent>
                            { }
                            <Grid item xs={12} lg={4}>
                                <Card className="recommendation-card" sx={{ height: '100%' }}>
                                    <CardContent sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="h5" gutterBottom sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: '#1B5E20',
                                            mb: 2
                                        }}>
                                            <Agriculture fontSize="large" /> {t('aiRecommendation')}
                                        </Typography>

                                        <Divider sx={{ my: 2, width: '80%' }} />

                                        {recommendation ? (
                                            <>
                                                <Avatar sx={{
                                                    bgcolor: '#2E7D32',
                                                    width: 80,
                                                    height: 80,
                                                    mb: 3,
                                                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                                                }}>
                                                    <Grass sx={{ fontSize: 40 }} />
                                                </Avatar>

                                                <Typography variant="h4" color="#1B5E20" fontWeight="bold" gutterBottom>
                                                 {t(recommendation)}
                                                </Typography>

                                                <Chip label={`${t('accuracy')} : ${(confidence * 100).toFixed(1)}%`} color="success" />

                                                <Box sx={{
                                                    bgcolor: 'rgba(255,255,255,0.7)',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    width: '90%',
                                                    maxWidth: 300
                                                }}>
                                                    { }
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        📊 {t('confidenceScore')}: <strong>{(confidence * 100).toFixed(1)}%</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                       {t('basedon7parameters')}
                                                    </Typography>
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                <Avatar sx={{
                                                    bgcolor: '#E0E0E0',
                                                    width: 70,
                                                    height: 70,
                                                    mb: 3
                                                }}>
                                                    <Grass sx={{ fontSize: 35, color: '#757575' }} />
                                                </Avatar>

                                                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                                                    {t('awaitingAnalysis')}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" sx={{ px: 2, mb: 3 }}>
                                                  {t('adjustParameters')}
                                                </Typography>

                                                <Box sx={{
                                                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    width: '90%',
                                                    border: '1px dashed #4CAF50'
                                                }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>{t('tip')}</strong> {t('useRealisticValues')}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Card>
                    </Grid>


                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;