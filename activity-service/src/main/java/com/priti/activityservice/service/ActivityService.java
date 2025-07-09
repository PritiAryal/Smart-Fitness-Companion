package com.priti.activityservice.service;

import com.priti.activityservice.dto.ActivityRequestDTO;
import com.priti.activityservice.dto.ActivityResponseDTO;
import com.priti.activityservice.model.Activity;

import java.util.List;

public interface ActivityService {
    ActivityResponseDTO trackActivity(ActivityRequestDTO activityRequest);
    ActivityResponseDTO mapToResponse(Activity activity);

    List<ActivityResponseDTO> getUserActivities(String userId);

    ActivityResponseDTO getActivityById(String activityId);
}
