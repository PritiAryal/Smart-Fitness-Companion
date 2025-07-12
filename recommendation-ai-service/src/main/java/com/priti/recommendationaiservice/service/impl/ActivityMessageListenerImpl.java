package com.priti.recommendationaiservice.service.impl;

import com.priti.recommendationaiservice.model.Activity;
import com.priti.recommendationaiservice.service.ActivityAIService;
import com.priti.recommendationaiservice.service.ActivityMessageListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageListenerImpl implements ActivityMessageListener {

    private final ActivityAIService activityAIService;

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void processActivity(Activity activity) {
        log.info("Received activity for AI processing: {}", activity.getId());
        log.info("Generated recommendation: {}", activityAIService.generateRecommendation(activity));
    }
}
