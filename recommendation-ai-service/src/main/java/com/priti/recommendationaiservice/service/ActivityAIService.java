package com.priti.recommendationaiservice.service;

import com.priti.recommendationaiservice.model.Activity;

public interface ActivityAIService {
    String generateRecommendation(Activity activity);
}
