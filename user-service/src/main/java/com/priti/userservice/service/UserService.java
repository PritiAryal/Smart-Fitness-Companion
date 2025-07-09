package com.priti.userservice.service;

import com.priti.userservice.dto.RegisterRequest;
import com.priti.userservice.dto.UserResponse;
import com.priti.userservice.model.User;

public interface UserService {

    UserResponse getUserResponse(User user);
    
    UserResponse getUserProfile(String userId);

    UserResponse register(RegisterRequest registerRequest);
}
