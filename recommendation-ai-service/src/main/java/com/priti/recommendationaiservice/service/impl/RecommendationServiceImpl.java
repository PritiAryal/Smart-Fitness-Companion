package com.priti.recommendationaiservice.service.impl;

import com.priti.recommendationaiservice.model.Recommendation;
import com.priti.recommendationaiservice.repository.RecommendationRepository;
import com.priti.recommendationaiservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {
    private final RecommendationRepository recommendationRepository;

    @Override
    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    @Override
    public Recommendation getActivityRecommendation(String activityId) {
        return recommendationRepository.findByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("No recommendation found for activity ID: " + activityId));
    }
}
