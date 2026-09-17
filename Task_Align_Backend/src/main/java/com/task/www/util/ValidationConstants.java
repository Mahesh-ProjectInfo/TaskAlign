package com.task.www.util;

public final class ValidationConstants {

    private ValidationConstants() {
    }

    
    public static final int NAME_MIN_LENGTH = 3;
    public static final int NAME_MAX_LENGTH = 100;

    
    public static final int EMAIL_MAX_LENGTH = 100;

    
    public static final String MOBILE_REGEX = "^[6-9][0-9]{9}$";

    
    public static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,20}$";

    
    public static final String OTP_REGEX = "^[0-9]{6}$";

}
