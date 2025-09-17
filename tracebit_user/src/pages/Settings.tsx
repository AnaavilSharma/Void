import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  DataUsage as DataUsageIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyReports: true,
    dataSharing: true,
    locationTracking: true,
    analyticsTracking: true,
    language: 'en',
    theme: 'light',
    autoSync: true,
    dataRetention: 12,
    gpsAccuracy: 5,
    batteryOptimization: true,
    backgroundCollection: true,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setSnackbarMessage('Settings saved successfully!');
    setSnackbarOpen(true);
    console.log('Settings saved:', settings);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Configure your Trace-Bit application preferences
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsIcon sx={{ mr: 1, color: '#2E7D32' }} />
            <Typography variant="h6">Notification Settings</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              />
            }
            label="Push Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              />
            }
            label="SMS Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.weeklyReports}
                onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
              />
            }
            label="Weekly Reports"
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon sx={{ mr: 1, color: '#2E7D32' }} />
            <Typography variant="h6">Privacy & Data</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.dataSharing}
                onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
              />
            }
            label="Share data for research (anonymized)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.locationTracking}
                onChange={(e) => handleSettingChange('locationTracking', e.target.checked)}
              />
            }
            label="Location Tracking"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.analyticsTracking}
                onChange={(e) => handleSettingChange('analyticsTracking', e.target.checked)}
              />
            }
            label="Analytics Tracking"
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Data Retention Period (months)</Typography>
            <Slider
              value={settings.dataRetention}
              onChange={(e, value) => handleSettingChange('dataRetention', value)}
              min={1}
              max={24}
              step={1}
              marks
              valueLabelDisplay="auto"
              sx={{ width: 300 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaletteIcon sx={{ mr: 1, color: '#2E7D32' }} />
            <Typography variant="h6">App Preferences</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                label="Theme"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="auto">Auto</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoSync}
                onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
              />
            }
            label="Auto Sync Data"
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DataUsageIcon sx={{ mr: 1, color: '#2E7D32' }} />
            <Typography variant="h6">Data Collection</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.backgroundCollection}
                onChange={(e) => handleSettingChange('backgroundCollection', e.target.checked)}
              />
            }
            label="Background Data Collection"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.batteryOptimization}
                onChange={(e) => handleSettingChange('batteryOptimization', e.target.checked)}
              />
            }
            label="Battery Optimization"
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>GPS Accuracy (meters)</Typography>
            <Slider
              value={settings.gpsAccuracy}
              onChange={(e, value) => handleSettingChange('gpsAccuracy', value)}
              min={1}
              max={50}
              step={1}
              marks={[
                { value: 1, label: '1m' },
                { value: 10, label: '10m' },
                { value: 25, label: '25m' },
                { value: 50, label: '50m' },
              ]}
              valueLabelDisplay="auto"
              sx={{ width: 300 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ backgroundColor: '#2E7D32' }}
        >
          Save Settings
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="App Version" 
                secondary="1.0.0" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Last Sync" 
                secondary="2025-09-17 14:30:25" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Data Usage" 
                secondary="2.3 MB" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Storage Used" 
                secondary="45.2 MB / 1 GB" 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
