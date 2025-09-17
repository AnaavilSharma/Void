import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import TripTrackingService, { TripData } from '../services/TripTrackingService';

const Logs: React.FC = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    const localTrips = TripTrackingService.getLocalTrips();
    setTrips(localTrips);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'warning';
      case 'completed': return 'success';
      case 'paused': return 'default';
      default: return 'default';
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.mode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportLogs = () => {
    const csvContent = [
      ['Trip ID', 'Start Time', 'End Time', 'Mode', 'Purpose', 'Distance (km)', 'Duration (min)', 'Status'],
      ...trips.map(trip => [
        trip.id,
        trip.startTime.toLocaleString(),
        trip.endTime?.toLocaleString() || 'In Progress',
        trip.mode || 'Unknown',
        trip.purpose || 'Unknown',
        trip.distance.toFixed(2),
        trip.duration.toString(),
        trip.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trip Logs
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View and export your trip history
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Search trips..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadTrips}
            sx={{ borderColor: '#2E7D32', color: '#2E7D32' }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportLogs}
            sx={{ backgroundColor: '#2E7D32' }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trip ID</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Distance (km)</TableCell>
                <TableCell>Duration (min)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No trips found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>{trip.id}</TableCell>
                    <TableCell>{trip.startTime.toLocaleString()}</TableCell>
                    <TableCell>{trip.endTime?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{trip.mode || 'Unknown'}</TableCell>
                    <TableCell>{trip.purpose || 'Unknown'}</TableCell>
                    <TableCell>{trip.distance.toFixed(2)}</TableCell>
                    <TableCell>{trip.duration}</TableCell>
                    <TableCell>
                      <Chip
                        label={trip.status}
                        color={getStatusColor(trip.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Logs;
