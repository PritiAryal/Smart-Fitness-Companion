package com.priti.recommendationaiservice.service;

import com.priti.recommendationaiservice.model.Activity;
import com.priti.recommendationaiservice.model.Recommendation;

public interface ActivityAIService {
    Recommendation generateRecommendation(Activity activity);

}
