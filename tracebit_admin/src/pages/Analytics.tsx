import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Directions as DirectionsIcon,
  People as PeopleIcon,
  Park as EcoIcon,
} from '@mui/icons-material';

const Analytics: React.FC = () => {
  const analyticsData = {
    totalTrips: 1247,
    activeUsers: 892,
    avgTripDistance: 8.5,
    totalCo2Saved: 2456,
    tripGrowth: 12.5,
    userGrowth: 8.3,
    co2Growth: 15.2,
  };

  const transportModes = [
    { mode: 'Walking', percentage: 35, count: 436, color: '#4CAF50' },
    { mode: 'Cycling', percentage: 25, count: 312, color: '#2196F3' },
    { mode: 'Public Transport', percentage: 30, count: 374, color: '#FF9800' },
    { mode: 'Private Vehicle', percentage: 10, count: 125, color: '#F44336' },
  ];

  const tripPurposes = [
    { purpose: 'Work', percentage: 45, count: 561 },
    { purpose: 'Education', percentage: 20, count: 249 },
    { purpose: 'Shopping', percentage: 15, count: 187 },
    { purpose: 'Recreation', percentage: 12, count: 150 },
    { purpose: 'Medical', percentage: 5, count: 62 },
    { purpose: 'Other', percentage: 3, count: 38 },
  ];

  const hourlyDistribution = [
    { hour: '06:00', trips: 45 },
    { hour: '07:00', trips: 120 },
    { hour: '08:00', trips: 180 },
    { hour: '09:00', trips: 95 },
    { hour: '10:00', trips: 60 },
    { hour: '11:00', trips: 40 },
    { hour: '12:00', trips: 80 },
    { hour: '13:00', trips: 70 },
    { hour: '14:00', trips: 55 },
    { hour: '15:00', trips: 65 },
    { hour: '16:00', trips: 90 },
    { hour: '17:00', trips: 150 },
    { hour: '18:00', trips: 200 },
    { hour: '19:00', trips: 120 },
    { hour: '20:00', trips: 80 },
    { hour: '21:00', trips: 40 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Comprehensive data analysis and insights for transportation planning
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 3
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DirectionsIcon sx={{ fontSize: 40, color: '#2E7D32', mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Trips
                </Typography>
                <Typography variant="h4">
                  {analyticsData.totalTrips.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: '#4CAF50', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                    +{analyticsData.tripGrowth}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#1976D2', mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Active Users
                </Typography>
                <Typography variant="h4">
                  {analyticsData.activeUsers.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: '#4CAF50', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                    +{analyticsData.userGrowth}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EcoIcon sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  CO₂ Saved (kg)
                </Typography>
                <Typography variant="h4">
                  {analyticsData.totalCo2Saved.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: '#4CAF50', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                    +{analyticsData.co2Growth}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        mb: 3
      }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Transport Mode Distribution
          </Typography>
          <Box sx={{ mt: 2 }}>
            {transportModes.map((mode) => (
              <Box key={mode.mode} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{mode.mode}</Typography>
                  <Typography variant="body2">{mode.percentage}% ({mode.count})</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={mode.percentage} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: mode.color,
                    }
                  }} 
                />
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Trip Purpose Distribution
          </Typography>
          <List sx={{ mt: 1 }}>
            {tripPurposes.map((purpose) => (
              <ListItem key={purpose.purpose} sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <Chip 
                    label={purpose.percentage + '%'} 
                    size="small" 
                    sx={{ backgroundColor: '#2E7D32', color: 'white' }}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={purpose.purpose}
                  secondary={`${purpose.count} trips`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Hourly Trip Distribution
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(17, 1fr)',
            gap: 1,
            alignItems: 'end',
            height: 200
          }}>
            {hourlyDistribution.map((data) => (
              <Box key={data.hour} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    height: `${(data.trips / 200) * 100}%`,
                    backgroundColor: '#2E7D32',
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }}
                />
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  {data.hour}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
