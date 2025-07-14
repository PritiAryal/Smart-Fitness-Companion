import { 
  Box, 
  Button, 
  FormControl, 
  TextField, 
  InputLabel, 
  Select, 
  MenuItem,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Avatar,
  Stack,
  Fade
} from '@mui/material'
import { 
  Add, 
  FitnessCenter, 
  Timer, 
  LocalFireDepartment,
  DirectionsRun,
  DirectionsBike,
  DirectionsWalk
} from '@mui/icons-material'
import React, { useState } from 'react';
import { addActivity } from '../services/api.js'



const ActivityForm = ({ onActivityAdded }) => {
    const [activity, setActivity] = useState({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {}
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addActivity(activity);
            onActivityAdded();
            setActivity({ type: "RUNNING", duration: "", caloriesBurned: "", additionalMetrics: {} });
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    }

    const getActivityIcon = (type) => {
        switch(type) {
            case 'RUNNING': return <DirectionsRun />;
            case 'CYCLING': return <DirectionsBike />;
            case 'WALKING': return <DirectionsWalk />;
            default: return <FitnessCenter />;
        }
    };

    const getActivityColor = (type) => {
        switch(type) {
            case 'RUNNING': return '#FF6B6B';
            case 'CYCLING': return '#4ECDC4';
            case 'WALKING': return '#96CEB4';
            default: return '#74B9FF';
        }
    };

  return (
    <Box>
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
          {/* <Avatar 
            sx={{ 
              background: `linear-gradient(135deg, ${getActivityColor(activity.type)}, ${getActivityColor(activity.type)}CC)`,
              width: 48,
              height: 48
            }}
          >
            {getActivityIcon(activity.type)}
          </Avatar> */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
              Add New Activity
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Track your fitness journey
            </Typography>
          </Box>
        </Stack>
    <Card 
      elevation={0}
      sx={{ 
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Activity Type Selection */}
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
              <Typography variant="h6" gutterBottom sx={{ color: 'black', mb: 2 }} fontWeight="bold">
                Choose Activity Type
              </Typography>
              <Grid container spacing={2}>
                {['RUNNING', 'CYCLING', 'WALKING'].map((type) => (
                  <Grid item xs={4} key={type}>
                    <Paper
                      elevation={0}
                      onClick={() => setActivity({ ...activity, type })}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: activity.type === type 
                          ? `linear-gradient(135deg, ${getActivityColor(type)}, ${getActivityColor(type)}CC)`
                          : 'rgba(255,255,255,0.9)',
                        color: activity.type === type ? 'white' : '#333',
                        border: activity.type === type 
                          ? `2px solid ${getActivityColor(type)}`
                          : '2px solid transparent',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          mx: 'auto', 
                          mb: 1,
                          background: activity.type === type ? 'rgba(255,255,255,0.2)' : getActivityColor(type),
                          color: activity.type === type ? 'white' : 'white'
                        }}
                      >
                        {getActivityIcon(type)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="bold">
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              </Paper>
            </Grid>

            {/* Duration Input */}
            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Avatar sx={{ background: '#4ECDC4', width: 32, height: 32 }}>
                    <Timer sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Duration
                  </Typography>
                </Stack>
                <TextField 
                  fullWidth
                  label="Minutes"
                  type="number"
                  value={activity.duration}
                  onChange={(e) => setActivity({ ...activity, duration: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'white'
                    }
                  }}
                />
              </Paper>
            </Grid>

            {/* Calories Input */}
            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Avatar sx={{ background: '#FF6B6B', width: 32, height: 32 }}>
                    <LocalFireDepartment sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Calories
                  </Typography>
                </Stack>
                <TextField 
                  fullWidth
                  label="Calories Burned"
                  type="number"
                  value={activity.caloriesBurned}
                  onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'white'
                    }
                  }}
                />
              </Paper>
            </Grid>

            {/* Submit Button */}
          </Grid>
          
          {/* Submit Button - Outside Grid for proper centering */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={loading}
              startIcon={<Add />}
              sx={{
                textAlign: 'center',
                width: '100%',
                maxWidth: '400px',
                py: 1.5,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${getActivityColor(activity.type)}, ${getActivityColor(activity.type)}CC)`,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  background: `linear-gradient(135deg, ${getActivityColor(activity.type)}, ${getActivityColor(activity.type)}BB)`
                },
                '&:disabled': {
                  opacity: 0.7
                }
              }}
            >
              {loading ? 'Adding Activity...' : 'Add Activity'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
    </Box>
  )
}

export default ActivityForm;

//rafce