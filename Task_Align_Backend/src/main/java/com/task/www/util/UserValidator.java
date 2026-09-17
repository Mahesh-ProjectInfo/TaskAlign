package com.task.www.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.task.www.dto.RegisterRequest;
import com.task.www.exception.FieldValidationException;
import com.task.www.repository.UserRepository;

@Component
public class UserValidator {

    private final UserRepository userRepository;

    public UserValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public void validateRegisterRequest(RegisterRequest request) {

        Map<String, String> errors = new HashMap<>();

        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (userRepository.existsByEmail(email)) {
            errors.put("email", "Email Address already exists");
        }

        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            errors.put("mobileNumber", "Mobile Number already exists");
        }

        if (request.getPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            errors.put("confirmPassword", "Passwords do not match");
        }

        if (!errors.isEmpty()) {
            throw new FieldValidationException(errors);
        }

    }

}

