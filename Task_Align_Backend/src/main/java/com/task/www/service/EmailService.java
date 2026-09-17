package com.task.www.service;

public interface EmailService {

    void sendOtp(String toEmail, String otp);

    void sendMail(
            String to,
            String subject,
            String body);

    void sendRegistrationSuccessMail(
            String toEmail,
            String fullName);

    void sendLoginSuccessMail(
            String toEmail,
            String fullName);

    void sendPasswordChangedMail(
            String toEmail,
            String fullName);
}