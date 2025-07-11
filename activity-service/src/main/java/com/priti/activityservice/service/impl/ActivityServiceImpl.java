package com.priti.activityservice.service.impl;

import com.priti.activityservice.dto.ActivityRequestDTO;
import com.priti.activityservice.dto.ActivityResponseDTO;
import com.priti.activityservice.model.Activity;
import com.priti.activityservice.repository.ActivityRepository;
import com.priti.activityservice.service.ActivityService;
import com.priti.activityservice.service.UserValidationService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor//@AllArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;

    @Override
    public ActivityResponseDTO trackActivity(ActivityRequestDTO activityRequest) {
        boolean isValidUser = userValidationService.validateUser(activityRequest.getUserId());
        if(!isValidUser){
            throw new RuntimeException("Invalid User: " + activityRequest.getUserId());
        }
        Activity activity = Activity.builder()
                .userId(activityRequest.getUserId())
                .type(activityRequest.getType())
                .duration(activityRequest.getDuration())
                .caloriesBurned(activityRequest.getCaloriesBurned())
                .startTime(activityRequest.getStartTime())
                .additionalMetrics(activityRequest.getAdditionalMetrics())
                .build();
        Activity savedActivity = activityRepository.save(activity);
        return mapToResponse(savedActivity);
    }

    @Override
    public ActivityResponseDTO mapToResponse(Activity activity) {
        ActivityResponseDTO response = new ActivityResponseDTO();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    @Override
    public List<ActivityResponseDTO> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ActivityResponseDTO getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id" + activityId));
    }
}
