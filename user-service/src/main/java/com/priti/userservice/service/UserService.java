package com.priti.userservice.service;

import com.priti.userservice.dto.UserRequestDTO;
import com.priti.userservice.dto.UserResponseDTO;
import com.priti.userservice.model.User;

public interface UserService {

    UserResponseDTO getUserResponse(User user);
    
    UserResponseDTO getUserProfile(String userId);

    UserResponseDTO register(UserRequestDTO userRequestDTO);

    Boolean existByUserId(String userId);
}
