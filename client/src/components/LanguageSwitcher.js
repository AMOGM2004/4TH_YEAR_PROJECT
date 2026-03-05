import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    handleClose();
  };

  return (
    <div>
      <Button
        color="inherit"
        startIcon={<TranslateIcon />}
        onClick={handleClick}
      >
        {language.toUpperCase()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('kn')}>ಕನ್ನಡ</MenuItem>
        <MenuItem onClick={() => changeLanguage('hi')}>हिन्दी</MenuItem>
        <MenuItem onClick={() => changeLanguage('te')}>తెలుగు</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;