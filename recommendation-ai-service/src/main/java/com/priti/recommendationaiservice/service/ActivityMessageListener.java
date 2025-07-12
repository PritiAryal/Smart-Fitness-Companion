package com.priti.recommendationaiservice.service;

import com.priti.recommendationaiservice.model.Activity;

public interface ActivityMessageListener {
    void processActivity(Activity activity);
}
