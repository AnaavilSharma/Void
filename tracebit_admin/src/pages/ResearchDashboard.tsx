import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

interface TripData {
  id: string;
  tripNumber: string;
  user: string;
  startTime: string;
  endTime: string;
  purpose: string;
  transportMode: string;
  distance: number;
  duration: number;
  co2Emission: number;
  dataQuality: string;
  consentGiven: boolean;
}

interface HouseholdData {
  id: string;
  householdId: string;
  householdSize: number;
  incomeLevel: string;
  vehicleOwnership: string;
  residenceType: string;
  surveyDate: string;
  isComplete: boolean;
}

const NATPACDashboard: React.FC = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [households, setHouseholds] = useState<HouseholdData[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const mockTrips: TripData[] = [
      {
        id: '1',
        tripNumber: 'TRP-001',
        user: 'user@example.com',
        startTime: '2024-01-15 08:30:00',
        endTime: '2024-01-15 09:15:00',
        purpose: 'work',
        transportMode: 'public_transport',
        distance: 8500,
        duration: 2700,
        co2Emission: 0.8,
        dataQuality: 'excellent',
        consentGiven: true,
      },
      {
        id: '2',
        tripNumber: 'TRP-002',
        user: 'user2@example.com',
        startTime: '2024-01-15 10:00:00',
        endTime: '2024-01-15 10:30:00',
        purpose: 'shopping',
        transportMode: 'walking',
        distance: 1200,
        duration: 1800,
        co2Emission: 0.0,
        dataQuality: 'good',
        consentGiven: true,
      },
    ];

    const mockHouseholds: HouseholdData[] = [
      {
        id: '1',
        householdId: 'HH-001',
        householdSize: 4,
        incomeLevel: '50000-100000',
        vehicleOwnership: 'car_only',
        residenceType: 'apartment',
        surveyDate: '2024-01-15',
        isComplete: true,
      },
      {
        id: '2',
        householdId: 'HH-002',
        householdSize: 2,
        incomeLevel: '25000-50000',
        vehicleOwnership: 'bicycle_only',
        residenceType: 'house',
        surveyDate: '2024-01-14',
        isComplete: false,
      },
    ];

    setTrips(mockTrips);
    setHouseholds(mockHouseholds);
  }, []);

  const handleViewTrip = (trip: TripData) => {
    setSelectedTrip(trip);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTrip(null);
  };

  const handleExportData = () => {
    console.log('Exporting data...');
  };

  const getDataQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'fair': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            NATPAC Research Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Scientific planning and data analysis for transportation research
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{ mr: 1 }}
          >
            Refresh Data
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      <Box>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 3
        }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Trips Collected
              </Typography>
              <Typography variant="h4">
                {trips.length}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Households Surveyed
              </Typography>
              <Typography variant="h4">
                {households.length}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Data Quality Score
              </Typography>
              <Typography variant="h4">
                94%
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Consent Rate
              </Typography>
              <Typography variant="h4">
                98%
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trip Data Collection
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Trip Number</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Distance</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>CO₂ (kg)</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell>Consent</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>{trip.tripNumber}</TableCell>
                      <TableCell>{trip.user}</TableCell>
                      <TableCell>{trip.startTime}</TableCell>
                      <TableCell>{trip.purpose}</TableCell>
                      <TableCell>{trip.transportMode.replace('_', ' ')}</TableCell>
                      <TableCell>{formatDistance(trip.distance)}</TableCell>
                      <TableCell>{formatDuration(trip.duration)}</TableCell>
                      <TableCell>{trip.co2Emission.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={trip.dataQuality}
                          color={getDataQualityColor(trip.dataQuality) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={trip.consentGiven ? 'Yes' : 'No'}
                          color={trip.consentGiven ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewTrip(trip)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Household Survey Data
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Household ID</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Income Level</TableCell>
                    <TableCell>Vehicle Ownership</TableCell>
                    <TableCell>Residence Type</TableCell>
                    <TableCell>Survey Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {households.map((household) => (
                    <TableRow key={household.id}>
                      <TableCell>{household.householdId}</TableCell>
                      <TableCell>{household.householdSize}</TableCell>
                      <TableCell>{household.incomeLevel.replace('_', ' - ')}</TableCell>
                      <TableCell>{household.vehicleOwnership.replace('_', ' ')}</TableCell>
                      <TableCell>{household.residenceType.replace('_', ' ')}</TableCell>
                      <TableCell>{household.surveyDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={household.isComplete ? 'Complete' : 'Incomplete'}
                          color={household.isComplete ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Trip Details - {selectedTrip?.tripNumber}</DialogTitle>
        <DialogContent>
          {selectedTrip && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>User:</strong> {selectedTrip.user}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Start Time:</strong> {selectedTrip.startTime}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>End Time:</strong> {selectedTrip.endTime}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Purpose:</strong> {selectedTrip.purpose}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Transport Mode:</strong> {selectedTrip.transportMode.replace('_', ' ')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Distance:</strong> {formatDistance(selectedTrip.distance)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Duration:</strong> {formatDuration(selectedTrip.duration)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>CO₂ Emission:</strong> {selectedTrip.co2Emission.toFixed(2)} kg
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Data Quality:</strong> {selectedTrip.dataQuality}
              </Typography>
              <Typography variant="body1">
                <strong>Consent Given:</strong> {selectedTrip.consentGiven ? 'Yes' : 'No'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NATPACDashboard;
