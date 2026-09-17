package com.task.www.service;

import com.task.www.dto.ChangePasswordRequest;
import com.task.www.dto.EditProfileRequest;
import com.task.www.dto.ForgotPasswordRequest;
import com.task.www.dto.LoginRequest;
import com.task.www.dto.MobileLoginRequest;
import com.task.www.dto.RegisterRequest;
import com.task.www.dto.ResetPasswordRequest;
import com.task.www.dto.VerifyOtpRequest;
import com.task.www.dto.ApiResponse;
import com.task.www.dto.LoginResponse;
import com.task.www.dto.ProfileResponse;
import com.task.www.dto.RegisterResponse;

public interface AuthService {

    ApiResponse<RegisterResponse> register(RegisterRequest request);

    ApiResponse<LoginResponse> login(LoginRequest request);
    
    ApiResponse<String> sendMobileOtp(String mobileNumber);

    ApiResponse<LoginResponse> mobileLogin(MobileLoginRequest request);
    
    ApiResponse<String> sendForgotPasswordOtp(String email);
    
    ApiResponse<String> verifyOtp(VerifyOtpRequest request);
    
    ApiResponse<String> resetPassword(ResetPasswordRequest request);

    ApiResponse<ProfileResponse> editProfile(EditProfileRequest request,
            String email);
    
    ApiResponse<String> changePassword(ChangePasswordRequest request,
            String email);
    
    ApiResponse<ProfileResponse> getProfile(String email);

    
}
