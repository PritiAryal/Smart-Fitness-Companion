package com.priti.apigateway.user.service.impl;

import com.priti.apigateway.user.dto.UserRequestDTO;
import com.priti.apigateway.user.dto.UserResponseDTO;
import com.priti.apigateway.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final WebClient userServiceWebClient;


    @Override
    public Mono<Boolean> validateUser(String userId) {
        log.info("Calling user Validation API for userId: {}", userId);
            return userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve() //it will make api call
                    .bodyToMono(Boolean.class)
                    .onErrorResume(WebClientResponseException.class, e -> {
                        if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                            log.error("User Not Found: {}", userId);
                            return Mono.error(new RuntimeException("User Not Found: " + userId));
                        } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                            log.error("Invalid Request for User: {}", userId);
                            return Mono.error(new RuntimeException("Invalid Request: " + userId));
                        } else {
                            log.error("Error validating user: {}", e.getMessage());
                            return Mono.error(new RuntimeException("Unexpected error: " + e.getMessage()));
                        }
                    });
    }

    @Override
    public Mono<UserResponseDTO> registerUser(UserRequestDTO request){
        log.info("Calling user Registration API for email: {}", request.getEmail());
        return userServiceWebClient.post()
                .uri("/api/users/register")
                .bodyValue(request)
                .retrieve() //it will make api call
                .bodyToMono(UserResponseDTO.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        log.error("Bad Request: {}", e.getMessage());
                        return Mono.error(new RuntimeException("Bad Request: " + e.getMessage()));
                    } else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
                        log.error("Internal Server Error: {}", e.getMessage());
                        return Mono.error(new RuntimeException("Internal Server Error: " + e.getMessage()));
                    } else {
                        log.error("Error validating user: {}", e.getMessage());
                        return Mono.error(new RuntimeException("Unexpected error: " + e.getMessage()));
                    }
                });

    }
}
