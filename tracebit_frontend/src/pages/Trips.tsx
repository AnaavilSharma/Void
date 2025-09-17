import React, { useState } from 'react';
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
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const Trips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const trips = [
    {
      id: '1',
      tripNumber: 'TRP-001',
      user: 'John Doe',
      startTime: '2025-09-17 08:30',
      endTime: '2025-09-17 09:15',
      purpose: 'Work',
      transportMode: 'Public Transport',
      distance: 12.5,
      duration: 45,
      co2Emission: 2.1,
      status: 'Completed',
    },
    {
      id: '2',
      tripNumber: 'TRP-002',
      user: 'Jane Smith',
      startTime: '2025-09-17 10:00',
      endTime: '2025-09-17 10:30',
      purpose: 'Shopping',
      transportMode: 'Walking',
      distance: 2.3,
      duration: 30,
      co2Emission: 0,
      status: 'Completed',
    },
    {
      id: '3',
      tripNumber: 'TRP-003',
      user: 'Mike Johnson',
      startTime: '2025-09-17 14:00',
      endTime: null,
      purpose: 'Education',
      transportMode: 'Cycling',
      distance: 8.7,
      duration: null,
      co2Emission: 0,
      status: 'In Progress',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.tripNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trip Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage and monitor all trip data collection
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: '#2E7D32' }}
        >
          Add New Trip
        </Button>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 3
      }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Trips
            </Typography>
            <Typography variant="h4">
              {trips.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Trips
            </Typography>
            <Typography variant="h4">
              {trips.filter(trip => trip.status === 'In Progress').length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Distance (km)
            </Typography>
            <Typography variant="h4">
              {trips.reduce((sum, trip) => sum + trip.distance, 0).toFixed(1)}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              CO₂ Saved (kg)
            </Typography>
            <Typography variant="h4">
              {trips.reduce((sum, trip) => sum + trip.co2Emission, 0).toFixed(1)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Trip Data
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trip Number</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Distance (km)</TableCell>
                <TableCell>Duration (min)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>{trip.tripNumber}</TableCell>
                  <TableCell>{trip.user}</TableCell>
                  <TableCell>{trip.startTime}</TableCell>
                  <TableCell>{trip.endTime || '-'}</TableCell>
                  <TableCell>{trip.purpose}</TableCell>
                  <TableCell>{trip.transportMode}</TableCell>
                  <TableCell>{trip.distance}</TableCell>
                  <TableCell>{trip.duration || '-'}</TableCell>
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
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Trips;
