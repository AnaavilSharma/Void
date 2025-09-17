import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  ArrowForward as NextIcon,
  ArrowBack as BackIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const Survey: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    age: '',
    gender: '',
    occupation: '',
    education: '',
    
    // Household Information
    householdSize: '',
    income: '',
    vehicleOwnership: [] as string[],
    
    // Travel Behavior
    primaryTransportMode: '',
    tripFrequency: '',
    travelPreferences: [] as string[],
    
    // Feedback
    appRating: '',
    suggestions: '',
    consent: false,
  });

  const steps = [
    'Personal Information',
    'Household Information', 
    'Travel Behavior',
    'Feedback & Consent'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: 'vehicleOwnership' | 'travelPreferences', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = () => {
    console.log('Survey submitted:', formData);
    alert('Survey submitted successfully! Thank you for your participation.');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
            />
            
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
            />
            
            <FormControl fullWidth>
              <InputLabel>Education Level</InputLabel>
              <Select
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
              >
                <MenuItem value="high_school">High School</MenuItem>
                <MenuItem value="bachelor">Bachelor's Degree</MenuItem>
                <MenuItem value="master">Master's Degree</MenuItem>
                <MenuItem value="phd">PhD</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Household Information
            </Typography>
            
            <TextField
              fullWidth
              label="Household Size"
              type="number"
              value={formData.householdSize}
              onChange={(e) => handleInputChange('householdSize', e.target.value)}
            />
            
            <FormControl fullWidth>
              <InputLabel>Monthly Income</InputLabel>
              <Select
                value={formData.income}
                onChange={(e) => handleInputChange('income', e.target.value)}
              >
                <MenuItem value="below_25000">Below ₹25,000</MenuItem>
                <MenuItem value="25000-50000">₹25,000 - ₹50,000</MenuItem>
                <MenuItem value="50000-100000">₹50,000 - ₹1,00,000</MenuItem>
                <MenuItem value="100000-200000">₹1,00,000 - ₹2,00,000</MenuItem>
                <MenuItem value="above_200000">Above ₹2,00,000</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl component="fieldset">
              <Typography variant="subtitle1" gutterBottom>
                Vehicle Ownership
              </Typography>
              <FormGroup>
                {['No Vehicle', 'Bicycle', 'Motorcycle', 'Car', 'Multiple Vehicles'].map((vehicle) => (
                  <FormControlLabel
                    key={vehicle}
                    control={
                      <Checkbox
                        checked={formData.vehicleOwnership.includes(vehicle)}
                        onChange={() => handleCheckboxChange('vehicleOwnership', vehicle)}
                      />
                    }
                    label={vehicle}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Travel Behavior
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Primary Transport Mode</InputLabel>
              <Select
                value={formData.primaryTransportMode}
                onChange={(e) => handleInputChange('primaryTransportMode', e.target.value)}
              >
                <MenuItem value="walking">Walking</MenuItem>
                <MenuItem value="cycling">Cycling</MenuItem>
                <MenuItem value="public_transport">Public Transport</MenuItem>
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="motorcycle">Motorcycle</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Trip Frequency (per week)</InputLabel>
              <Select
                value={formData.tripFrequency}
                onChange={(e) => handleInputChange('tripFrequency', e.target.value)}
              >
                <MenuItem value="1-2">1-2 trips</MenuItem>
                <MenuItem value="3-5">3-5 trips</MenuItem>
                <MenuItem value="6-10">6-10 trips</MenuItem>
                <MenuItem value="11-15">11-15 trips</MenuItem>
                <MenuItem value="above_15">Above 15 trips</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl component="fieldset">
              <Typography variant="subtitle1" gutterBottom>
                Travel Preferences
              </Typography>
              <FormGroup>
                {['Eco-friendly', 'Time-efficient', 'Cost-effective', 'Comfortable', 'Safe'].map((preference) => (
                  <FormControlLabel
                    key={preference}
                    control={
                      <Checkbox
                        checked={formData.travelPreferences.includes(preference)}
                        onChange={() => handleCheckboxChange('travelPreferences', preference)}
                      />
                    }
                    label={preference}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Feedback & Consent
            </Typography>
            
            <FormControl component="fieldset">
              <Typography variant="subtitle1" gutterBottom>
                How would you rate the Trace-Bit app?
              </Typography>
              <RadioGroup
                value={formData.appRating}
                onChange={(e) => handleInputChange('appRating', e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <FormControlLabel
                    key={rating}
                    value={rating.toString()}
                    control={<Radio />}
                    label={`${rating} Star${rating > 1 ? 's' : ''}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Suggestions for improvement"
              value={formData.suggestions}
              onChange={(e) => handleInputChange('suggestions', e.target.value)}
            />
            
            <Alert severity="info">
              <Typography variant="body2">
                By submitting this survey, you consent to the use of your responses for research purposes. 
                All data will be anonymized and used to improve transportation planning.
              </Typography>
            </Alert>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.consent}
                  onChange={(e) => handleInputChange('consent', e.target.checked)}
                />
              }
              label="I consent to the use of my survey responses for research purposes"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Survey
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Help us improve transportation planning by sharing your travel behavior
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<BackIcon />}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.consent}
              startIcon={<CheckIcon />}
              sx={{ backgroundColor: '#2E7D32' }}
            >
              Submit Survey
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NextIcon />}
              sx={{ backgroundColor: '#2E7D32' }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Survey;
