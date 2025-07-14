import { 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Box,
  Avatar,
  Chip,
  Stack,
  Paper,
  Fade,
  Skeleton
} from '@mui/material';
import { 
  DirectionsRun,
  DirectionsBike,
  DirectionsWalk,
  FitnessCenter,
  Timer,
  LocalFireDepartment,
  TrendingUp,
  CalendarToday
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api.js';
// import Grid2 from '@mui/material/Unstable_Grid2';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await getActivities();
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchActivities();
    }, []);

    const getActivityIcon = (type) => {
        switch(type?.toUpperCase()) {
            case 'RUNNING': return <DirectionsRun />;
            case 'CYCLING': return <DirectionsBike />;
            case 'WALKING': return <DirectionsWalk />;
            default: return <FitnessCenter />;
        }
    };

    const getActivityColor = (type) => {
        switch(type?.toUpperCase()) {
            case 'RUNNING': return '#FF6B6B';
            case 'CYCLING': return '#4ECDC4';
            case 'WALKING': return '#96CEB4';
            default: return '#74B9FF';
        }
    };

    const getIntensityLevel = (calories, duration) => {
        if (!calories || !duration) return 'Low';
        const caloriesPerMinute = calories / duration;
        if (caloriesPerMinute > 10) return 'High';
        if (caloriesPerMinute > 6) return 'Medium';
        return 'Low';
    };

    const getIntensityColor = (level) => {
        switch(level) {
            case 'High': return '#FF6B6B';
            case 'Medium': return '#FFD93D';
            case 'Low': return '#6BCF7F';
            default: return '#6BCF7F';
        }
    };

    if (loading) {
        return (
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white', mb: 3 }}>
                    Your Activities
                </Typography>
                <Grid container spacing={3}>
                    {[1,2,3,4].map((item) => (
                        <Grid item xs={12} sm={6} key={item}>
                            <Skeleton 
                                variant="rectangular" 
                                height={200} 
                                sx={{ borderRadius: 3 }} 
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="700" sx={{ 
                    color: 'white', 
                    mb: 1,
                    background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Activity Timeline
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {activities.length} workouts completed
                </Typography>
            </Box>

            {/* Activities Timeline */}
            {activities.length === 0 ? (
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 8, 
                        textAlign: 'center', 
                        borderRadius: 6,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}
                >
                    <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <FitnessCenter sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                    <Typography variant="h5" fontWeight="600" color="text.primary" gutterBottom>
                        Start Your Journey
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Add your first workout to begin tracking your fitness progress
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {activities.map((activity, index) => {
                        const intensityLevel = getIntensityLevel(activity.caloriesBurned, activity.duration);
                        const activityColor = getActivityColor(activity.type);
                        
                        return (
                            <Grid item xs={12} sm={6} key={activity.id}>
                                <Fade in={true} timeout={600 + index * 150}>
                                    <Card 
                                        elevation={0}
                                        onClick={() => navigate(`/activities/${activity.id}`)}
                                        sx={{ 
                                            cursor: 'pointer',
                                            borderRadius: 4,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: '4px',
                                                height: '100%',
                                                background: `linear-gradient(180deg, ${activityColor}, ${activityColor}80)`,
                                            },
                                            '&:hover': {
                                                transform: 'translateX(6px) scale(1.01)',
                                                boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                                                '& .activity-main-icon': {
                                                    transform: 'rotate(8deg) scale(1.05)'
                                                }
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 2.5, pl: 3 }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                {/* Left: Activity Icon & Type */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 140 }}>
                                                    <Box sx={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        borderRadius: '16px',
                                                        background: `linear-gradient(135deg, ${activityColor}, ${activityColor}CC)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 1.5,
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: `0 6px 16px ${activityColor}30`
                                                    }}>
                                                        <Box className="activity-main-icon" sx={{ transition: 'all 0.3s ease' }}>
                                                            {getActivityIcon(activity.type)}
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="700" sx={{ 
                                                            textTransform: 'capitalize',
                                                            color: '#2c3e50',
                                                            mb: 0.5,
                                                            fontSize: '1rem'
                                                        }}>
                                                            {activity.type?.toLowerCase() || 'Workout'}
                                                        </Typography>
                                                        <Chip 
                                                            label={intensityLevel}
                                                            size="small"
                                                            sx={{ 
                                                                background: `linear-gradient(45deg, ${getIntensityColor(intensityLevel)}, ${getIntensityColor(intensityLevel)}CC)`,
                                                                color: 'white',
                                                                fontSize: '0.65rem',
                                                                fontWeight: '600',
                                                                height: 20,
                                                                borderRadius: 2
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>

                                                {/* Right: Stats */}
                                                <Box sx={{ flex: 1 }}>
                                                    <Stack direction="row" spacing={2} justifyContent="space-between">
                                                        {/* Duration */}
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" fontWeight="800" sx={{ 
                                                                color: '#2c3e50',
                                                                lineHeight: 1,
                                                                mb: 0.3
                                                            }}>
                                                                {activity.duration || 0}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ 
                                                                color: '#7f8c8d',
                                                                fontWeight: '600',
                                                                textTransform: 'uppercase',
                                                                fontSize: '0.7rem'
                                                            }}>
                                                                Min
                                                            </Typography>
                                                        </Box>

                                                        {/* Calories */}
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" fontWeight="800" sx={{ 
                                                                color: '#e74c3c',
                                                                lineHeight: 1,
                                                                mb: 0.3
                                                            }}>
                                                                {activity.caloriesBurned || 0}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ 
                                                                color: '#7f8c8d',
                                                                fontWeight: '600',
                                                                textTransform: 'uppercase',
                                                                fontSize: '0.7rem'
                                                            }}>
                                                                Cal
                                                            </Typography>
                                                        </Box>

                                                        {/* Date */}
                                                        {activity.createdAt && (
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <Typography variant="body2" fontWeight="600" sx={{ 
                                                                    color: '#2c3e50',
                                                                    mb: 0.3,
                                                                    fontSize: '0.85rem'
                                                                }}>
                                                                    {new Date(activity.createdAt).toLocaleDateString('en-US', { 
                                                                        month: 'short', 
                                                                        day: 'numeric' 
                                                                    })}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ 
                                                                    color: '#7f8c8d',
                                                                    fontSize: '0.65rem'
                                                                }}>
                                                                    {new Date(activity.createdAt).toLocaleTimeString([], { 
                                                                        hour: '2-digit', 
                                                                        minute: '2-digit' 
                                                                    })}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}

export default ActivityList;