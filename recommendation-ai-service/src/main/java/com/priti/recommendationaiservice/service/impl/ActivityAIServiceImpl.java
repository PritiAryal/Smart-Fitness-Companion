package com.priti.recommendationaiservice.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.priti.recommendationaiservice.model.Activity;
import com.priti.recommendationaiservice.model.Recommendation;
import com.priti.recommendationaiservice.service.ActivityAIService;
import com.priti.recommendationaiservice.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityAIServiceImpl implements ActivityAIService {

    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("Response from AI {}: {}", activity.getId(), aiResponse);
        return processRecommendationAiResponse(activity, aiResponse);
        //return aiResponse;
    }

    private Recommendation processRecommendationAiResponse(Activity activity, String aiResponse){
        try {
            ObjectMapper objectMapper = new ObjectMapper(); //It is used to convert JSON strings to Java objects and vice versa
            JsonNode rootNode = objectMapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            //log.info("Parsed Response from AI {}: {}", activity.getId(), jsonContent);

            JsonNode analysisJson = objectMapper.readTree(jsonContent); //Creating JsonNode from the JSON string
            JsonNode analysisNode = analysisJson.path("analysis"); //This retrieves the "analysis" node from the JSON

            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall analysis here: ");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace analysis here: ");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart rate analysis here: ");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories burned analysis here: ");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }

    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("No specific analysis available. Please try again later.")
                .improvements(Collections.singletonList("No specific improvements provided. Please continue with your regular fitness routine."))
                .suggestions(Collections.singletonList("No specific suggestions provided. Please consider consulting a fitness expert."))
                .safety(Collections.singletonList("Safety Guidelines: No specific guidelines provided. So please ensure to follow general safety practices."))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safety) {
        List<String> safetyList = new ArrayList<>();
        if(safety.isArray()) {
            safety.forEach(safetyPoint -> safetyList.add(safetyPoint.asText())); ;
        }
        return safetyList.isEmpty() ?
                Collections.singletonList("Safety Guidelines: No specific guidelines provided. So please ensure to follow general safety practices.") :
                safetyList;
    }

    private List<String> extractSuggestions(JsonNode suggestions) {
        List<String> suggestionList = new ArrayList<>();
        if(suggestions.isArray()) {
            suggestions.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestionList.add(String.format("Workout: %s, Description: %s", workout, description));
            });
        }
        return suggestionList.isEmpty() ?
                Collections.singletonList("Suggestions: No specific suggestions provided.") :
                suggestionList;

    }

    private List<String> extractImprovements(JsonNode improvements) {
        List<String> improvementList = new ArrayList<>();
        if(improvements.isArray()) {
            improvements.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String recommendationDetail = improvement.path("recommendation").asText();
                improvementList.add(String.format("Area: %s, Recommendation: %s", area, recommendationDetail));
            });
        }
        return improvementList.isEmpty() ?
                Collections.singletonList("Improvements: No specific improvements provided.") :
                improvementList;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }// This method adds a section to the full analysis string, checking if the key exists in the JSON node and appending its content with a prefix.

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s
        
        Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
        Ensure the response follows the EXACT JSON format shown above.
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }
}
