package com.priti.activityservice.controller;

import com.priti.activityservice.dto.ActivityRequestDTO;
import com.priti.activityservice.dto.ActivityResponseDTO;
import com.priti.activityservice.service.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("api/activities")
public class ActivityController {

    private final ActivityService activityService;
    @PostMapping
    public ResponseEntity<ActivityResponseDTO> trackActivity(@RequestBody ActivityRequestDTO activityRequest, @RequestHeader("X-User-ID") String userId) {
        if (userId != null){
            activityRequest.setUserId(userId);
        }
        return ResponseEntity.ok(activityService.trackActivity(activityRequest));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponseDTO>> getUserActivities(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponseDTO> getActivityById(@PathVariable String activityId) {
        ActivityResponseDTO activity = activityService.getActivityById(activityId);
        return ResponseEntity.ok(activity);
    }


}
