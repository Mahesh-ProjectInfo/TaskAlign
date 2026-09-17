package com.task.www.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.dto.ChangePasswordRequest;
import com.task.www.dto.EditProfileRequest;
import com.task.www.dto.ForgotPasswordRequest;
import com.task.www.dto.LoginRequest;
import com.task.www.dto.MobileLoginRequest;
import com.task.www.dto.MobileOtpRequest;
import com.task.www.dto.RegisterRequest;
import com.task.www.dto.ResetPasswordRequest;
import com.task.www.dto.VerifyOtpRequest;
import com.task.www.dto.ApiResponse;
import com.task.www.dto.LoginResponse;
import com.task.www.dto.ProfileResponse;
import com.task.www.dto.RegisterResponse;
import com.task.www.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    /**
     * Register User
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        return new ResponseEntity<>(
                authService.register(request),
                HttpStatus.CREATED);
    }

    /**
     * Email Login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Send Mobile OTP
     */
    @PostMapping("/send-mobile-otp")
    public ResponseEntity<ApiResponse<String>> sendMobileOtp(
            @Valid @RequestBody MobileOtpRequest request) {

        return ResponseEntity.ok(
                authService.sendMobileOtp(request.getMobileNumber()));
    }

    /**
     * Mobile Login
     */
    @PostMapping("/mobile-login")
    public ResponseEntity<ApiResponse<LoginResponse>> mobileLogin(
            @Valid @RequestBody MobileLoginRequest request) {

        return ResponseEntity.ok(
                authService.mobileLogin(request));
    }

    /**
     * Forgot Password - Send OTP
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                authService.sendForgotPasswordOtp(
                        request.getEmail()));
    }

    /**
     * Verify OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        return ResponseEntity.ok(
                authService.verifyOtp(request));
    }

    /**
     * Reset Password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(request));
    }

    /**
     * Edit Profile
     */
    @PutMapping(value = "/edit-profile", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ProfileResponse>> editProfile(
            @Valid @ModelAttribute EditProfileRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                authService.editProfile(request, email));
    }

    /**
     * Change Password
     */
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                authService.changePassword(request, email));
    }
    
    /**
     * Get Current User Profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                authService.getProfile(email));
    }

}
