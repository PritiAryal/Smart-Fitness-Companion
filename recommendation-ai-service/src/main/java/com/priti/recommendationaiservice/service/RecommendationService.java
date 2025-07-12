package com.priti.recommendationaiservice.service;

import com.priti.recommendationaiservice.model.Recommendation;

import java.util.List;

public interface RecommendationService {
    List<Recommendation> getUserRecommendation(String userId);

    Recommendation getActivityRecommendation(String activityId);
}
