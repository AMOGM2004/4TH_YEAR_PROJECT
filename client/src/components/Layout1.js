import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  AppBar, Toolbar, Typography, Button, Box,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Avatar, Container
} from '@mui/material';
import {
  Menu, Dashboard, History, Calculate,
  BugReport, Cloud, TrendingUp, Translate,
  Logout, Settings, Person
} from '@mui/icons-material';

const Layout = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();   // ✅ Added
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { text: t('dashboard'), icon: <Dashboard />, path: '/dashboard' },
  { text: t('fertilizerCalculator'), icon: <Calculate />, path: '/fertilizer' },
  { text: t('diseaseDetection'), icon: <BugReport />, path: '/disease' },
    { text: 'Disease Detection', icon: <BugReport />, path: '/disease' },
    { text: 'Weather Forecast', icon: <Cloud />, path: '/weather' },
    { text: 'Yield Prediction', icon: <TrendingUp />, path: '/yield' },
    { text: 'Multi-language', icon: <Translate />, path: '/language' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1300, bgcolor: '#2E7D32' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
              <Dashboard />
            </Avatar>
            <Typography variant="h6" noWrap>
              CropAI Advisor
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LanguageSwitcher /> 
            <IconButton color="inherit">
              <Settings />
            </IconButton>
            <IconButton color="inherit">
              <Person />
            </IconButton>
            <Button 
              color="inherit" 
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#f5f5f5',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          {/* User Profile */}
          <Box sx={{ p: 2, mb: 2, bgcolor: '#E8F5E9', borderRadius: 2, textAlign: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: '#2E7D32' }}>
              <Person />
            </Avatar>
            <Typography variant="h6">Farmer Profile</Typography>
            <Typography variant="body2" color="text.secondary">
              Premium User
            </Typography>
          </Box>

          {/* Navigation Menu */}
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': { bgcolor: '#E8F5E9' }
                }}
              >
                <ListItemIcon sx={{ color: '#2E7D32' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;