package com.priti.userservice.service.impl;

import com.priti.userservice.dto.UserRequestDTO;
import com.priti.userservice.dto.UserResponseDTO;
import com.priti.userservice.model.User;
import com.priti.userservice.repository.UserRepository;
import com.priti.userservice.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponseDTO getUserResponse(User user) {
        UserResponseDTO userResponse = new UserResponseDTO();
        userResponse.setId(user.getId());
        userResponse.setKeycloakId(user.getKeycloakId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        return userResponse;
    }

    @Override
    public UserResponseDTO getUserProfile(String userId) {
        User user= userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getUserResponse(user);
    }


    @Override
    public UserResponseDTO register(UserRequestDTO userRequestDTO) {

        if(userRepository.existsByEmail(userRequestDTO.getEmail())) {
            User existingUser = userRepository.findByEmail(userRequestDTO.getEmail());
            return getUserResponse(existingUser);
        }

        User user = new User();
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(userRequestDTO.getPassword());
        user.setKeycloakId(userRequestDTO.getKeycloakId());
        user.setFirstName(userRequestDTO.getFirstName());
        user.setLastName(userRequestDTO.getLastName());

        User savedUser = userRepository.save(user);
        return getUserResponse(savedUser);
    }

    @Override
    public Boolean existByUserId(String userId) {
        log.info("Calling user Validation API for userId: {}", userId);
        return userRepository.existsByKeycloakId(userId);
    }
}
