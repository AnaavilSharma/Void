import React, { useState, useEffect } from 'react';
import TripTrackingService, { TripData, LocationData } from '../services/TripTrackingService';
import {
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Divider,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  LocationOn as LocationIcon,
  Directions as DirectionsIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  CloudSync as SyncIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';


const UserDashboard: React.FC = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [showTripDialog, setShowTripDialog] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [tripForm, setTripForm] = useState({
    origin: '',
    destination: '',
    mode: '',
    purpose: '',
    accompanyingTravelers: 0,
  });

  const [settings, setSettings] = useState({
    autoTracking: true,
    gpsEnabled: true,
    dataSharing: true,
    backgroundSync: true,
    consentGiven: false,
  });

  const transportModes = [
    'Walking', 'Cycling', 'Bus', 'Train', 'Metro', 
    'Two-wheeler', 'Car', 'Taxi', 'Other'
  ];

  const tripPurposes = [
    'Work', 'Education', 'Shopping', 'Leisure', 
    'Medical', 'Social', 'Other'
  ];

  useEffect(() => {
    loadUserData();
    checkConsent();
  }, []);

  const loadUserData = () => {
    const localTrips = TripTrackingService.getLocalTrips();
    if (localTrips.length > 0) {
      setTrips(localTrips);
    } else {
      const mockTrips: TripData[] = [
        {
          id: '1',
          startTime: new Date('2025-09-17T08:30:00'),
          endTime: new Date('2025-09-17T09:15:00'),
          startLocation: {
            latitude: 12.9716,
            longitude: 77.5946,
            accuracy: 5,
            timestamp: new Date('2025-09-17T08:30:00'),
          },
          endLocation: {
            latitude: 12.9816,
            longitude: 77.6046,
            accuracy: 5,
            timestamp: new Date('2025-09-17T09:15:00'),
          },
          route: [],
          distance: 12.5,
          duration: 45,
          mode: 'Bus',
          purpose: 'Work',
          accompanyingTravelers: 0,
          isAutomatic: true,
          status: 'completed',
        },
        {
          id: '2',
          startTime: new Date('2025-09-17T10:00:00'),
          endTime: new Date('2025-09-17T10:30:00'),
          startLocation: {
            latitude: 12.9816,
            longitude: 77.6046,
            accuracy: 5,
            timestamp: new Date('2025-09-17T10:00:00'),
          },
          endLocation: {
            latitude: 12.9866,
            longitude: 77.6096,
            accuracy: 5,
            timestamp: new Date('2025-09-17T10:30:00'),
          },
          route: [],
          distance: 2.3,
          duration: 30,
          mode: 'Walking',
          purpose: 'Shopping',
          accompanyingTravelers: 1,
          isAutomatic: false,
          status: 'completed',
        },
      ];
      setTrips(mockTrips);
    }
  };

  const checkConsent = () => {
    const consent = localStorage.getItem('tripConsent');
    if (!consent) {
      setShowConsentDialog(true);
    } else {
      setSettings(prev => ({ ...prev, consentGiven: true }));
    }
  };

  const handleConsent = (accepted: boolean) => {
    if (accepted) {
      localStorage.setItem('tripConsent', 'true');
      setSettings(prev => ({ ...prev, consentGiven: true }));
      setSnackbarMessage('Consent recorded. You can start tracking trips!');
    } else {
      setSnackbarMessage('Consent required to use trip tracking features.');
    }
    setShowConsentDialog(false);
    setSnackbarOpen(true);
  };

  const startTripTracking = async () => {
    if (!settings.consentGiven) {
      setShowConsentDialog(true);
      return;
    }

    try {
      const trip = await TripTrackingService.startTripTracking(
        (location: LocationData) => {
          console.log('Location update:', location);
        },
        (trip: TripData) => {
          setCurrentTrip(trip);
        }
      );

      setCurrentTrip(trip);
      setIsTracking(true);
      setSnackbarMessage('Trip tracking started automatically!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to start trip tracking:', error);
      setSnackbarMessage('Failed to start trip tracking. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const stopTripTracking = () => {
    const completedTrip = TripTrackingService.stopTripTracking();
    if (completedTrip) {
      setTrips(prev => [completedTrip, ...prev]);
      TripTrackingService.saveTripToLocal(completedTrip);
      setCurrentTrip(null);
      setIsTracking(false);
      setSnackbarMessage('Trip completed and saved!');
      setSnackbarOpen(true);
    }
  };

  const openManualTripDialog = () => {
    setTripForm({
      origin: '',
      destination: '',
      mode: '',
      purpose: '',
      accompanyingTravelers: 0,
    });
    setShowTripDialog(true);
  };

  const saveManualTrip = () => {
    const newTrip: TripData = {
      id: Date.now().toString(),
      startTime: new Date(),
      endTime: new Date(),
      startLocation: {
        latitude: 12.9716 + (Math.random() - 0.5) * 0.01,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
        accuracy: 10,
        timestamp: new Date(),
      },
      endLocation: {
        latitude: 12.9816 + (Math.random() - 0.5) * 0.01,
        longitude: 77.6046 + (Math.random() - 0.5) * 0.01,
        accuracy: 10,
        timestamp: new Date(),
      },
      route: [],
      distance: Math.random() * 20 + 1,
      duration: Math.floor(Math.random() * 60 + 10),
      mode: tripForm.mode,
      purpose: tripForm.purpose,
      accompanyingTravelers: tripForm.accompanyingTravelers,
      isAutomatic: false,
      status: 'completed',
    };

    setTrips(prev => [newTrip, ...prev]);
    TripTrackingService.saveTripToLocal(newTrip);
    setShowTripDialog(false);
    setSnackbarMessage('Manual trip logged successfully!');
    setSnackbarOpen(true);
  };

  const syncData = async () => {
    try {
      const localTrips = TripTrackingService.getLocalTrips();
      for (const trip of localTrips) {
        await TripTrackingService.syncWithServer(trip);
      }
      setSnackbarMessage('Data synced with NATPAC server!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Sync failed. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'warning';
      case 'completed': return 'success';
      case 'paused': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <StartIcon />;
      case 'completed': return <CheckIcon />;
      case 'paused': return <WarningIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
  const totalTrips = trips.length;
  const completedTrips = trips.filter(trip => trip.status === 'completed').length;
  const co2Saved = trips.reduce((sum, trip) => {
    const co2PerKm = trip.mode === 'Walking' ? 0 : trip.mode === 'Cycling' ? 0 : 0.2;
    return sum + (trip.distance * co2PerKm);
  }, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Trip Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Track your journeys and contribute to transportation research
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 3
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DirectionsIcon sx={{ fontSize: 40, color: '#2E7D32', mr: 2 }} />
              <Box>
                <Typography variant="h4">{totalTrips}</Typography>
                <Typography color="textSecondary">Total Trips</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ fontSize: 40, color: '#1976D2', mr: 2 }} />
              <Box>
                <Typography variant="h4">{totalDistance.toFixed(1)} km</Typography>
                <Typography color="textSecondary">Distance Traveled</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckIcon sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
              <Box>
                <Typography variant="h4">{completedTrips}</Typography>
                <Typography color="textSecondary">Completed</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, color: '#FF9800', mr: 2 }} />
              <Box>
                <Typography variant="h4">{co2Saved.toFixed(1)} kg</Typography>
                <Typography color="textSecondary">CO₂ Saved</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Trip Tracking
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoTracking}
                onChange={(e) => setSettings(prev => ({ ...prev, autoTracking: e.target.checked }))}
              />
            }
            label="Automatic Trip Detection"
          />
          <Chip
            label={isTracking ? 'Tracking Active' : 'Not Tracking'}
            color={isTracking ? 'success' : 'default'}
            icon={isTracking ? <StartIcon /> : <StopIcon />}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {!isTracking ? (
            <Button
              variant="contained"
              startIcon={<StartIcon />}
              onClick={startTripTracking}
              disabled={!settings.consentGiven}
              sx={{ backgroundColor: '#2E7D32' }}
            >
              Start Trip
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<StopIcon />}
              onClick={stopTripTracking}
              sx={{ backgroundColor: '#f44336' }}
            >
              Stop Trip
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={openManualTripDialog}
            sx={{ borderColor: '#2E7D32', color: '#2E7D32' }}
          >
            Log Manual Trip
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={syncData}
            sx={{ borderColor: '#1976D2', color: '#1976D2' }}
          >
            Sync Data
          </Button>
        </Box>

        {currentTrip && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Active Trip:</strong> Started at {currentTrip.startTime.toLocaleTimeString()}
              {currentTrip.startLocation && ` from ${currentTrip.startLocation.latitude.toFixed(4)}, ${currentTrip.startLocation.longitude.toFixed(4)}`}
            </Typography>
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Trips
        </Typography>
        
        {trips.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <DirectionsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No trips recorded yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start tracking your first trip to see it here
            </Typography>
          </Box>
        ) : (
          <List>
            {trips.map((trip, index) => (
              <React.Fragment key={trip.id}>
                <ListItem>
                  <ListItemIcon>
                    {getStatusIcon(trip.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1">
                          {trip.startLocation ? `${trip.startLocation.latitude.toFixed(4)}, ${trip.startLocation.longitude.toFixed(4)}` : 'Unknown'} → {trip.endLocation ? `${trip.endLocation.latitude.toFixed(4)}, ${trip.endLocation.longitude.toFixed(4)}` : 'In Progress'}
                        </Typography>
                        <Chip
                          label={trip.status}
                          color={getStatusColor(trip.status) as any}
                          size="small"
                        />
                        {trip.isAutomatic && (
                          <Chip label="Auto" color="primary" size="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {trip.startTime.toLocaleString()} - {trip.endTime?.toLocaleString() || 'In Progress'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {trip.mode || 'Unknown'} • {trip.purpose || 'Unknown'} • {trip.distance.toFixed(1)} km • {trip.duration} min
                          {trip.accompanyingTravelers > 0 && ` • ${trip.accompanyingTravelers} travelers`}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < trips.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Dialog open={showTripDialog} onClose={() => setShowTripDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Log Manual Trip</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2
            }}>
              <TextField
                fullWidth
                label="Origin"
                value={tripForm.origin}
                onChange={(e) => setTripForm(prev => ({ ...prev, origin: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Destination"
                value={tripForm.destination}
                onChange={(e) => setTripForm(prev => ({ ...prev, destination: e.target.value }))}
              />
              <FormControl fullWidth>
                <InputLabel>Transport Mode</InputLabel>
                <Select
                  value={tripForm.mode}
                  onChange={(e) => setTripForm(prev => ({ ...prev, mode: e.target.value }))}
                >
                  {transportModes.map((mode) => (
                    <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Trip Purpose</InputLabel>
                <Select
                  value={tripForm.purpose}
                  onChange={(e) => setTripForm(prev => ({ ...prev, purpose: e.target.value }))}
                >
                  {tripPurposes.map((purpose) => (
                    <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="number"
                label="Accompanying Travelers"
                value={tripForm.accompanyingTravelers}
                onChange={(e) => setTripForm(prev => ({ ...prev, accompanyingTravelers: parseInt(e.target.value) || 0 }))}
                inputProps={{ min: 0, max: 10 }}
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTripDialog(false)}>Cancel</Button>
          <Button onClick={saveManualTrip} variant="contained" sx={{ backgroundColor: '#2E7D32' }}>
            Save Trip
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showConsentDialog} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle>Data Collection Consent</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            To provide you with the best trip tracking experience and contribute to transportation research, 
            we need your consent to collect and process the following data:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Location data (GPS coordinates)" secondary="For trip tracking and route analysis" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ScheduleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Trip timing and duration" secondary="For travel pattern analysis" />
            </ListItem>
            <ListItem>
              <ListItemIcon><DirectionsIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Transport mode and purpose" secondary="For transportation planning insights" />
            </ListItem>
            <ListItem>
              <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Accompanying travelers" secondary="For household travel analysis" />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Privacy Protection:</strong> All data is anonymized and stored securely. 
              You can pause or stop tracking at any time in your settings.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConsent(false)} color="error">
            Decline
          </Button>
          <Button onClick={() => handleConsent(true)} variant="contained" sx={{ backgroundColor: '#2E7D32' }}>
            I Consent
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UserDashboard;
