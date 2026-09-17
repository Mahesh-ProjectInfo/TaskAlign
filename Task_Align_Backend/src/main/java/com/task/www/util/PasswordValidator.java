package com.task.www.util;

import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {

    public boolean isValidPassword(String password) {

        if (password == null) {
            return false;
        }

        return password.matches(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,20}$"
        );
    }

}
