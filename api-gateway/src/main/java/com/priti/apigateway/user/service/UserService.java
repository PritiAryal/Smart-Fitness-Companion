package com.priti.apigateway.user.service;

import com.priti.apigateway.user.dto.UserRequestDTO;
import com.priti.apigateway.user.dto.UserResponseDTO;
import reactor.core.publisher.Mono;

public interface UserService {

    Mono<Boolean> validateUser(String userId);

    Mono<UserResponseDTO> registerUser(UserRequestDTO request);
}
