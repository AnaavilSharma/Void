import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Directions as DirectionsIcon,
  People as PeopleIcon,
  Park as EcoIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Trips Today',
      value: '1,247',
      change: '+12%',
      icon: <DirectionsIcon sx={{ fontSize: 40, color: '#2E7D32' }} />,
      color: '#2E7D32',
    },
    {
      title: 'Active Users',
      value: '892',
      change: '+8%',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#1976D2' }} />,
      color: '#1976D2',
    },
    {
      title: 'CO₂ Saved (kg)',
      value: '2,456',
      change: '+15%',
      icon: <EcoIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      color: '#4CAF50',
    },
    {
      title: 'Data Quality',
      value: '94%',
      change: '+2%',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FF9800',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        NATPAC Research Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Real-time transportation data collection and analysis
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 3
        }}>
          {stats.map((stat, index) => (
            <Card key={index} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h4" component="div" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: stat.color }}>
                  {stat.change} from yesterday
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3
        }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Trip Patterns Over Time
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="body1" color="text.secondary">
                Chart visualization will be implemented here
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Transport Mode Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Walking</Typography>
                <Typography variant="body2">35%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={35} sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Cycling</Typography>
                <Typography variant="body2">25%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={25} sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Public Transport</Typography>
                <Typography variant="body2">30%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={30} sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Private Vehicle</Typography>
                <Typography variant="body2">10%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={10} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
