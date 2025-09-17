import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Chip, Alert } from '@mui/material';
import { PlayArrow as StartIcon, Stop as StopIcon } from '@mui/icons-material';
import TripMap from '../components/TripMap';
import TripTrackingService, { TripData, LocationData } from '../services/TripTrackingService';

const Map: React.FC = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const localTrips = TripTrackingService.getLocalTrips();
    setTrips(localTrips);
  };

  const startTripTracking = async () => {
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
    } catch (error) {
      console.error('Failed to start trip tracking:', error);
    }
  };

  const stopTripTracking = () => {
    const completedTrip = TripTrackingService.stopTripTracking();
    if (completedTrip) {
      setTrips(prev => [completedTrip, ...prev]);
      TripTrackingService.saveTripToLocal(completedTrip);
      setCurrentTrip(null);
      setIsTracking(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trip Map
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Track your trips and view your journey history
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip
              label={isTracking ? 'Tracking Active' : 'Not Tracking'}
              color={isTracking ? 'success' : 'default'}
              icon={isTracking ? <StartIcon /> : <StopIcon />}
            />
            <Typography variant="body2" color="text.secondary">
              {trips.length} trips recorded
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {!isTracking ? (
              <Button
                variant="contained"
                startIcon={<StartIcon />}
                onClick={startTripTracking}
                sx={{ backgroundColor: '#2E7D32' }}
              >
                Start Trip Tracking
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<StopIcon />}
                onClick={stopTripTracking}
                sx={{ backgroundColor: '#f44336' }}
              >
                Stop Trip Tracking
              </Button>
            )}
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
      </Box>

      <TripMap 
        trips={trips}
        currentTrip={currentTrip}
        onLocationUpdate={(location) => console.log('Map received location update:', location)}
        height="600px"
      />
    </Box>
  );
};

export default Map;
