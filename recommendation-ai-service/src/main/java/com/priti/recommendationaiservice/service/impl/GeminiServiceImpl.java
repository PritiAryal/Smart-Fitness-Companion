package com.priti.recommendationaiservice.service.impl;

import com.priti.recommendationaiservice.service.GeminiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpStatus;

import java.lang.reflect.MalformedParameterizedTypeException;
import java.util.Map;

@Service
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public String getAnswer(String question) {
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", question)
                        })
                });

        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();


//        String response = webClient.post()
//                .uri(uriBuilder -> uriBuilder
//                        .path(geminiApiUrl)
//                        .queryParam("key", geminiApiKey)
//                        .build())
//                .header("Content-Type", "application/json")
//                .bodyValue(requestBody)
//                .retrieve()
//                .onStatus( status -> status.isError(), clientResponse -> {
//                    log.error("Error response from Gemini API: {}", clientResponse.statusCode());
//                    return clientResponse.createException();
//                })
//                .bodyToMono(String.class)
//                .block();

        return response;
    }
}
