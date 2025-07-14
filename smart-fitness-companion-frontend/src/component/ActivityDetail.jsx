import { 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  Typography, 
  Chip,
  LinearProgress,
  Avatar,
  Fade,
  Skeleton,
  IconButton,
  Stack,
  Paper
} from '@mui/material';
import { 
  FitnessCenter, 
  Timer, 
  LocalFireDepartment, 
  TrendingUp, 
  Lightbulb, 
  Security,
  ArrowBack,
  PlayCircleOutline,
  CalendarToday,
  DirectionsRun,
  DirectionsBike,
  DirectionsWalk
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { getActivityDetail, getActivityById } from '../services/api';
import { useParams, useNavigate } from 'react-router'

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      setLoading(true);
      try {
        // Fetch both activity data and recommendations in parallel
        const [activityResponse, recommendationResponse] = await Promise.all([
          getActivityById(id),
          getActivityDetail(id)
        ]);
        
        console.log("Activity Response:", activityResponse.data);
        console.log("Recommendation Response:", recommendationResponse.data);
        
        // Merge activity data with recommendations data
        const mergedActivity = {
          ...activityResponse.data, // Basic activity data (duration, calories, type, etc.)
          ...recommendationResponse.data, // AI recommendations data (recommendation, improvements, suggestions, safety)
        };
        
        console.log("Merged Activity Data:", mergedActivity);
        
        // Set the merged activity data
        setActivity(mergedActivity);
        setRecommendation(recommendationResponse.data);
        
      } catch (error) {
        console.error("Error fetching activity detail:", error);
        // If activity fetch fails, try the recommendation endpoint as fallback
        try {
          const response = await getActivityDetail(id);
          console.log("Fallback API Response:", response.data);
          setActivity(response.data);
          setRecommendation(response.data);
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
          setActivity({ error: "Failed to load activity" });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivityDetail();
    }
  }, [id]);

  // Activity type to color mapping
  const getActivityColor = (type) => {
    const colors = {
      running: '#FF6B6B',
      cycling: '#4ECDC4',
      swimming: '#45B7D1',
      walking: '#96CEB4',
      yoga: '#FFEAA7',
      weightlifting: '#DDA0DD',
      cardio: '#FF7675'
    };
    return colors[type?.toLowerCase()] || '#74B9FF';
  };

  // Activity type to icon mapping
  const getActivityIcon = (type) => {
    switch(type?.toUpperCase()) {
      case 'RUNNING': return <DirectionsRun sx={{ fontSize: 40, color: 'white' }} />;
      case 'CYCLING': return <DirectionsBike sx={{ fontSize: 40, color: 'white' }} />;
      case 'WALKING': return <DirectionsWalk sx={{ fontSize: 40, color: 'white' }} />;
      default: return <FitnessCenter sx={{ fontSize: 40, color: 'white' }} />;
    }
  };

  // Intensity calculation based on calories and duration
  const getIntensityLevel = (calories, duration) => {
    if (!calories || !duration) return 0;
    const caloriesPerMinute = calories / duration;
    if (caloriesPerMinute > 10) return 3; // High
    if (caloriesPerMinute > 6) return 2;  // Medium
    return 1; // Low
  };

  const getIntensityLabel = (level) => {
    const labels = ['Low', 'Medium', 'High'];
    return labels[level - 1] || 'Low';
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (activity?.error) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography color="inherit" sx={{ opacity: 0.9 }}>
            {activity.error}
          </Typography>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ mt: 2, color: 'white' }}
          >
            <ArrowBack />
          </IconButton>
        </Paper>
      </Box>
    );
  }

  const intensityLevel = getIntensityLevel(activity?.caloriesBurned || activity?.calories, activity?.duration || activity?.durationMinutes);
  const activityColor = getActivityColor(activity?.activityType || activity?.type);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pt: 3,
      pb: 6
    }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              mr: 2, 
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              '&:hover': { 
                transform: 'translateY(-1px)', 
                background: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
            Activity Details
          </Typography>
        </Box>

      <Fade in={true} timeout={800}>
        <Box>
          {/* Main Activity Card */}
          <Card 
            elevation={0}
            sx={{ 
              mb: 3, 
              borderRadius: 4,
              background: `linear-gradient(135deg, ${activityColor}15, ${activityColor}05)`,
              border: `2px solid ${activityColor}30`,
              overflow: 'visible',
              position: 'relative'
            }}
          >
            {/* Activity Icon */}
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: `linear-gradient(135deg, ${activityColor}, ${activityColor}CC)`,
                position: 'absolute',
                top: -20,
                left: 30,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                border: '4px solid white'
              }}
            >
              {getActivityIcon(activity?.activityType || activity?.type)}
            </Avatar>

            <CardContent sx={{ pt: 5, pb: 3 }}>
              <Box sx={{ ml: 10 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                    {activity?.activityType?.toLowerCase() || activity?.type || 'Activity'}
                  </Typography>
                  <Chip 
                    label={getIntensityLabel(intensityLevel)}
                    size="small"
                    sx={{ 
                      background: intensityLevel === 3 ? '#FF6B6B' : intensityLevel === 2 ? '#FFD93D' : '#6BCF7F',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Stack>

                {/* Stats Grid */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: 3, 
                  mt: 3 
                }}>
                  {/* Duration Stat */}
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ background: '#4ECDC4', width: 48, height: 48 }}>
                        <Timer />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {activity?.duration || activity?.durationMinutes || 'N/A'} min
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Calories Stat */}
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ background: '#FF6B6B', width: 48, height: 48 }}>
                        <LocalFireDepartment />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {activity?.caloriesBurned || activity?.calories || 'N/A'} cal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Calories Burned
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Intensity Progress */}
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <TrendingUp color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Intensity Level
                        </Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(intensityLevel / 3) * 100} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          background: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            background: intensityLevel === 3 ? '#FF6B6B' : intensityLevel === 2 ? '#FFD93D' : '#6BCF7F',
                            borderRadius: 4
                          }
                        }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {getIntensityLabel(intensityLevel)}
                      </Typography>
                    </Stack>
                  </Paper>

                  {/* Date/Time Stat */}
                  {activity?.createdAt && (
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        background: 'white',
                        border: '1px solid rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'translateY(-2px)' }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ background: '#9B59B6', width: 48, height: 48 }}>
                          <CalendarToday />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* AI Recommendations Card */}
          {(recommendation || activity?.recommendation) && (
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea15, #764ba205)',
                border: '2px solid #667eea30',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', width: 56, height: 56 }}>
                    <PlayCircleOutline sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    AI Recommendations
                  </Typography>
                </Stack>

                {/* Analysis Section */}
                {activity?.recommendation && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderRadius: 3, 
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <TrendingUp color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        Performance Analysis
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                      {activity.recommendation}
                    </Typography>
                  </Paper>
                )}

                {/* Improvements */}
                {activity?.improvements?.length > 0 && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderRadius: 3, 
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <TrendingUp sx={{ color: '#4ECDC4' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Areas for Improvement
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {activity.improvements.map((improvement, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            p: 2, 
                            borderRadius: 2,
                            background: '#4ECDC410',
                            border: '1px solid #4ECDC430'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              background: '#4ECDC4', 
                              mt: 1, 
                              mr: 2,
                              flexShrink: 0
                            }} 
                          />
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {improvement}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                )}

                {/* Suggestions */}
                {activity?.suggestions?.length > 0 && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderRadius: 3, 
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Lightbulb sx={{ color: '#FFD93D' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Suggestions
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {activity.suggestions.map((suggestion, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            p: 2, 
                            borderRadius: 2,
                            background: '#FFD93D10',
                            border: '1px solid #FFD93D30'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              background: '#FFD93D', 
                              mt: 1, 
                              mr: 2,
                              flexShrink: 0
                            }} 
                          />
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {suggestion}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                )}

                {/* Safety Guidelines */}
                {activity?.safety?.length > 0 && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Security sx={{ color: '#FF6B6B' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Safety Guidelines
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {activity.safety.map((safety, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            p: 2, 
                            borderRadius: 2,
                            background: '#FF6B6B10',
                            border: '1px solid #FF6B6B30'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              background: '#FF6B6B', 
                              mt: 1, 
                              mr: 2,
                              flexShrink: 0
                            }} 
                          />
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {safety}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Fade>
      </Box>
    </Box>
  )
}

export default ActivityDetail;