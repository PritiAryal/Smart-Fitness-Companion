import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { getActivityDetail } from '../services/api';
import { useParams } from 'react-router'

const ActivityDetailOld = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        console.log("API Response:", response.data); // Debug log
        
        // Handle different possible response structures
        if (response.data.activity) {
          setActivity(response.data.activity);
          setRecommendation(response.data.recommendation);
        } else {
          // If the response is the activity data directly
          setActivity(response.data);
          setRecommendation(response.data);
        }
      } catch (error) {
        console.error("Error fetching activity detail:", error);
        // Set error state to show something instead of infinite loading
        setActivity({ error: "Failed to load activity" });
      }
    };

    if (id) {
      fetchActivityDetail();
    }
  }, [id]);

  if (!activity) {
    return <Typography>Loading...</Typography>;
  }

  if (activity.error) {
    return <Typography color="error">{activity.error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Activity Detail</Typography>
          <Typography>Type: {activity.type}</Typography>
          <Typography> Duration: {activity.duration} minutes</Typography>
          <Typography>Calories Burned: {activity.caloriesBurned}</Typography>
          {/* <Typography>Date: {new Date(activity.createdAt).toLocaleString()}</Typography> */}
        </CardContent>
      </Card>

      {recommendation && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>AI Recommendation</Typography>
            <Typography variant="h6">Analysis</Typography>
            <Typography paragraph>{activity.recommendation}</Typography>
                          
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Improvements</Typography>
            {activity?.improvements?.map((improvement, index) => (
                <Typography key={index} paragraph>• {improvement}</Typography>
            ))}
                          
            <Divider sx={{ my: 2 }} />
                          
            <Typography variant="h6">Suggestions</Typography>
            {activity?.suggestions?.map((suggestion, index) => (
                <Typography key={index} paragraph>• {suggestion}</Typography>
            ))}
                          
            <Divider sx={{ my: 2 }} />
                          
            <Typography variant="h6">Safety Guidelines</Typography>
            {activity?.safety?.map((safety, index) => (
              <Typography key={index} paragraph>• {safety}</Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default ActivityDetailOld;