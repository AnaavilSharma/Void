import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Paper, Typography, IconButton, Chip } from '@mui/material';
import { MyLocation as MyLocationIcon, Route as RouteIcon } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import { TripData, LocationData } from '../services/TripTrackingService';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface TripMapProps {
  trips: TripData[];
  currentTrip: TripData | null;
  onLocationUpdate?: (location: LocationData) => void;
  height?: string;
}

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const TripMap: React.FC<TripMapProps> = ({ trips, currentTrip, onLocationUpdate, height = '400px' }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]); // Bangalore default
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location: [number, number] = [latitude, longitude];
          setUserLocation(location);
          setMapCenter(location);
          setMapZoom(15);
          
          if (onLocationUpdate) {
            onLocationUpdate({
              latitude,
              longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(),
            });
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, [onLocationUpdate]);

  const getTripColor = (trip: TripData, index: number) => {
    if (trip.status === 'active') return '#f44336';
    if (trip.status === 'completed') return '#4CAF50';
    return ['#2196F3', '#FF9800', '#9C27B0', '#00BCD4'][index % 4];
  };

  const getRouteCoordinates = (trip: TripData): [number, number][] => {
    if (trip.route && trip.route.length > 0) {
      return trip.route.map(loc => [loc.latitude, loc.longitude]);
    }
    if (trip.startLocation && trip.endLocation) {
      return [
        [trip.startLocation.latitude, trip.startLocation.longitude],
        [trip.endLocation.latitude, trip.endLocation.longitude]
      ];
    }
    return [];
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration}min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Paper sx={{ p: 2, height, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Trip Map
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {currentTrip && (
            <Chip
              icon={<RouteIcon />}
              label="Tracking Active"
              color="error"
              size="small"
            />
          )}
          <IconButton
            size="small"
            onClick={() => {
              if (userLocation) {
                setMapCenter(userLocation);
                setMapZoom(15);
              }
            }}
          >
            <MyLocationIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ height: 'calc(100% - 60px)', borderRadius: 1, overflow: 'hidden' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <Typography variant="body2">
                  <strong>Your Location</strong><br />
                  {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
                </Typography>
              </Popup>
            </Marker>
          )}

          {trips.map((trip, index) => {
            const routeCoords = getRouteCoordinates(trip);
            const color = getTripColor(trip, index);
            
            return (
              <React.Fragment key={trip.id}>
                {trip.startLocation && (
                  <Marker position={[trip.startLocation.latitude, trip.startLocation.longitude]}>
                    <Popup>
                      <Typography variant="body2">
                        <strong>Start: {trip.startTime.toLocaleTimeString()}</strong><br />
                        Mode: {trip.mode || 'Unknown'}<br />
                        Purpose: {trip.purpose || 'Unknown'}<br />
                        Distance: {formatDistance(trip.distance)}<br />
                        Duration: {formatDuration(trip.duration)}
                      </Typography>
                    </Popup>
                  </Marker>
                )}

                {trip.endLocation && (
                  <Marker position={[trip.endLocation.latitude, trip.endLocation.longitude]}>
                    <Popup>
                      <Typography variant="body2">
                        <strong>End: {trip.endTime?.toLocaleTimeString()}</strong><br />
                        Mode: {trip.mode || 'Unknown'}<br />
                        Purpose: {trip.purpose || 'Unknown'}<br />
                        Distance: {formatDistance(trip.distance)}<br />
                        Duration: {formatDuration(trip.duration)}
                      </Typography>
                    </Popup>
                  </Marker>
                )}

                {routeCoords.length > 1 && (
                  <Polyline
                    positions={routeCoords}
                    pathOptions={{
                      color: color,
                      weight: 4,
                      opacity: 0.8,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}

          {currentTrip && currentTrip.route && currentTrip.route.length > 0 && (
            <Polyline
              positions={currentTrip.route.map(loc => [loc.latitude, loc.longitude])}
              pathOptions={{
                color: '#f44336',
                weight: 6,
                opacity: 1,
                dashArray: '10, 10',
              }}
            />
          )}
        </MapContainer>
      </Box>
    </Paper>
  );
};

export default TripMap;
