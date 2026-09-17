package com.task.www.util;

public final class SecurityConstants {

    private SecurityConstants() {
    }

    public static final String JWT_PREFIX = "Bearer ";

    public static final String HEADER = "Authorization";

    public static final long JWT_EXPIRATION = 86400000L; // 24 Hours

    public static final int OTP_LENGTH = 6;

    public static final int OTP_EXPIRY_MINUTES = 5;

}
