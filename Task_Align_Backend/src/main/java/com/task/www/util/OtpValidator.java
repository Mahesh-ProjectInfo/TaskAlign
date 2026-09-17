package com.task.www.util;

import org.springframework.stereotype.Component;

@Component
public class OtpValidator {

    public boolean isValidOtp(String otp) {

        if (otp == null) {
            return false;
        }

        return otp.matches("^[0-9]{6}$");
    }

}
