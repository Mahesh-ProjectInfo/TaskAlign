package com.task.www.serviceImpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.task.www.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Task Align - OTP Verification");
        message.setText(
                "Dear User,\n\n"
                + "Your OTP for verification is: " + otp
                + "\n\nThis OTP is valid for 5 minutes."
                + "\n\nThank You,"
                + "\nTask Align Team"
        );

        mailSender.send(message);
    }

    @Override
    public void sendMail(
            String to,
            String subject,
            String body) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    @Async("emailTaskExecutor")
    @Override
    public void sendRegistrationSuccessMail(
            String toEmail,
            String fullName) {

        log.info("Sending registration welcome email asynchronously to: {}", toEmail);

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(toEmail);
            message.setSubject("Welcome to Task Align");

            message.setText(
                    "Dear " + fullName + ",\n\n"
                    + "Congratulations! Your Task Align account "
                    + "has been created successfully.\n\n"
                    + "You can now log in and start using the application.\n\n"
                    + "Regards,\n"
                    + "Task Align Team"
            );

            mailSender.send(message);
            log.info("Registration welcome email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send registration welcome email asynchronously to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    @Override
    public void sendLoginSuccessMail(
            String toEmail,
            String fullName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Task Align - Login Alert");

        message.setText(
                "Dear " + fullName + ",\n\n"
                + "You have successfully logged into your Task Align account.\n\n"
                + "If this login was not performed by you, "
                + "please change your password immediately.\n\n"
                + "Regards,\n"
                + "Task Align Team"
        );

        mailSender.send(message);
    }

    @Override
    public void sendPasswordChangedMail(
            String toEmail,
            String fullName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Task Align - Password Changed");

        message.setText(
                "Dear " + fullName + ",\n\n"
                + "Your account password has been changed successfully.\n\n"
                + "If you did not perform this action, "
                + "please contact support immediately.\n\n"
                + "Regards,\n"
                + "Task Align Team"
        );

        mailSender.send(message);
    }
}