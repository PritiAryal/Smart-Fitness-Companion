package com.priti.userservice.service.impl;

import com.priti.userservice.dto.RegisterRequest;
import com.priti.userservice.dto.UserResponse;
import com.priti.userservice.model.User;
import com.priti.userservice.repository.UserRepository;
import com.priti.userservice.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        return userResponse;
    }

    @Override
    public UserResponse getUserProfile(String userId) {
        User user= userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getUserResponse(user);
    }


    @Override
    public UserResponse register(RegisterRequest registerRequest) {

        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());

        User savedUser = userRepository.save(user);
        return getUserResponse(savedUser);
    }

}
