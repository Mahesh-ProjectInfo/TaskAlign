package com.task.www.util;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class OtpUtil {

    private static final SecureRandom RANDOM = new SecureRandom();

    public String generateOtp() {

        int otp = 100000 + RANDOM.nextInt(900000);

        return String.valueOf(otp);
    }

}
