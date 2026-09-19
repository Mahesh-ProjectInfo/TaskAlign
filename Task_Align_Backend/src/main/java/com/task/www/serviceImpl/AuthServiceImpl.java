package com.task.www.serviceImpl;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.task.www.config.JwtTokenProvider;
import com.task.www.dto.ApiResponse;
import com.task.www.dto.ChangePasswordRequest;
import com.task.www.dto.EditProfileRequest;
import com.task.www.dto.LoginRequest;
import com.task.www.dto.LoginResponse;
import com.task.www.dto.MobileLoginRequest;
import com.task.www.dto.ProfileResponse;
import com.task.www.dto.RegisterRequest;
import com.task.www.dto.RegisterResponse;
import com.task.www.dto.ResetPasswordRequest;
import com.task.www.dto.VerifyOtpRequest;
import com.task.www.entity.User;
import com.task.www.exception.InvalidOtpException;
import com.task.www.exception.PasswordMismatchException;
import com.task.www.exception.UserNotFoundException;
import com.task.www.repository.UserRepository;
import com.task.www.service.AuditService;
import com.task.www.service.AuthService;
import com.task.www.service.EmailService;
import com.task.www.service.SmsService;
import com.task.www.util.MessageConstants;
import com.task.www.util.OtpUtil;
import com.task.www.util.UserValidator;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

        private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final UserValidator userValidator;
        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider jwtTokenProvider;
        private final OtpUtil otpUtil;
        private final EmailService emailService;
        private final AuditService auditService;

        @Autowired
        private SmsService smsService;

        // Temporary OTP Storage (In-Memory)
        private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
        private final Map<String, LocalDateTime> otpExpiryStorage = new ConcurrentHashMap<>();

        @Override
        public ApiResponse<RegisterResponse> register(RegisterRequest request) {

                userValidator.validateRegisterRequest(request);

                User user = new User();

                user.setFullName(request.getFullName().trim());

                user.setEmail(request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "");

                user.setMobileNumber(request.getMobileNumber());

                user.setPassword(passwordEncoder.encode(request.getPassword()));

                user.setGender(request.getGender());

                user.setState(request.getState());

                user.setCountry(request.getCountry());

                User savedUser = userRepository.save(user);

                log.info("Registration successful for user: {}; welcome email queued.", user.getEmail());

                emailService.sendRegistrationSuccessMail(
                                user.getEmail(),
                                user.getFullName());

                RegisterResponse response = new RegisterResponse();

                response.setUserId(savedUser.getUserId());

                response.setFullName(savedUser.getFullName());

                response.setEmail(savedUser.getEmail());

                response.setMobileNumber(savedUser.getMobileNumber());

                auditService.saveAuditLog(
                                savedUser.getEmail(),
                                "REGISTER",
                                "User registered successfully",
                                null,
                                "SUCCESS");

                return new ApiResponse<>(
                                true,
                                MessageConstants.REGISTRATION_SUCCESS,
                                response);

        }

        @Override
        public ApiResponse<LoginResponse> login(LoginRequest request) {

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UserNotFoundException(
                                                MessageConstants.USER_NOT_FOUND));

                String token = jwtTokenProvider.generateToken(user.getEmail());

                LoginResponse response = new LoginResponse();

                response.setUserId(user.getUserId());

                response.setFullName(user.getFullName());

                response.setEmail(user.getEmail());

                response.setMobileNumber(user.getMobileNumber());

                response.setProfilePicture(user.getProfilePicture());

                response.setToken(token);

                auditService.saveAuditLog(
                                user.getEmail(),
                                "LOGIN",
                                "User logged in successfully",
                                null,
                                "SUCCESS");

                return new ApiResponse<>(
                                true,
                                MessageConstants.LOGIN_SUCCESS,
                                response);

        }

        @Override
        public ApiResponse<LoginResponse> mobileLogin(MobileLoginRequest request) {

                User user = userRepository.findByMobileNumber(request.getMobileNumber())
                                .orElseThrow(() -> new UserNotFoundException(
                                                MessageConstants.USER_NOT_FOUND));

                String savedOtp = otpStorage.get(request.getMobileNumber());

                if (savedOtp == null) {
                        throw new InvalidOtpException(MessageConstants.OTP_NOT_FOUND);
                }

                LocalDateTime expiryTime = otpExpiryStorage.get(request.getMobileNumber());

                if (expiryTime.isBefore(LocalDateTime.now())) {

                        otpStorage.remove(request.getMobileNumber());

                        otpExpiryStorage.remove(request.getMobileNumber());

                        throw new InvalidOtpException(MessageConstants.OTP_EXPIRED);

                }

                if (!savedOtp.equals(request.getOtp())) {

                        throw new InvalidOtpException(MessageConstants.INVALID_OTP);

                }

                otpStorage.remove(request.getMobileNumber());

                otpExpiryStorage.remove(request.getMobileNumber());

                String token = jwtTokenProvider.generateToken(user.getEmail());

                LoginResponse response = new LoginResponse();

                response.setUserId(user.getUserId());

                response.setFullName(user.getFullName());

                response.setEmail(user.getEmail());

                response.setMobileNumber(user.getMobileNumber());

                response.setProfilePicture(user.getProfilePicture());

                response.setToken(token);

                auditService.saveAuditLog(
                                user.getEmail(),
                                "LOGIN",
                                "User logged in successfully",
                                null,
                                "SUCCESS");

                return new ApiResponse<>(
                                true,
                                MessageConstants.LOGIN_SUCCESS,
                                response);

        }

        @Override
        public ApiResponse<String> sendMobileOtp(String mobileNumber) {

                User user = userRepository.findByMobileNumber(mobileNumber)
                                .orElseThrow(() -> new UserNotFoundException(
                                                MessageConstants.USER_NOT_FOUND));

                String otp = otpUtil.generateOtp();

                otpStorage.put(mobileNumber, otp);

                otpExpiryStorage.put(
                                mobileNumber,
                                LocalDateTime.now().plusMinutes(5));

                // 1. **Uncomment this code when the OTP needs to be sent to the user's email
                // for mobile login.**
                // 2. **Keep the ApiResponse code uncommented in all cases.**

                // emailService.sendOtp(user.getEmail(), otp);

                // **When using the MSG91 SMS service, uncomment this code.**

                smsService.sendOtp("+91" + user.getMobileNumber(), otp);

                // **When using the TWILIO SMS service, uncomment this code.**

                // try {
                // smsService.sendOtp(
                // "+91" + user.getMobileNumber(),
                // otp
                // );
                // } catch (Exception e) {
                //
                // System.out.println(
                // "Twilio SMS failed: " + e.getMessage()
                // );
                // }

                return new ApiResponse<>(
                                true,
                                "OTP Sent Successfully",
                                otp);

        }

        @Override
        public ApiResponse<String> sendForgotPasswordOtp(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                MessageConstants.USER_NOT_FOUND));

                String otp = otpUtil.generateOtp();

                otpStorage.put(email, otp);

                otpExpiryStorage.put(
                                email,
                                LocalDateTime.now().plusMinutes(5));

                emailService.sendOtp(email, otp);

                auditService.saveAuditLog(
                                user.getEmail(),
                                "FORGOT_PASSWORD",
                                "OTP sent successfully",
                                null,
                                "SUCCESS");

                return new ApiResponse<>(
                                true,
                                MessageConstants.OTP_SENT_SUCCESS,
                                null);

        }

        @Override
        public ApiResponse verifyOtp(VerifyOtpRequest request) {

                String key;

                // Mobile OTP
                if (request.getMobileNumber() != null
                                && !request.getMobileNumber().isBlank()) {

                        key = request.getMobileNumber();

                }
                // Email OTP
                else if (request.getEmail() != null
                                && !request.getEmail().isBlank()) {

                        key = request.getEmail();

                }
                // Neither provided
                else {
                        throw new InvalidOtpException(
                                        MessageConstants.OTP_NOT_FOUND);
                }

                // OTP generated and stored by Java
                String savedOtp = otpStorage.get(key);

                if (savedOtp == null) {
                        throw new InvalidOtpException(
                                        MessageConstants.OTP_NOT_FOUND);
                }

                // Get expiry time
                LocalDateTime expiryTime = otpExpiryStorage.get(key);

                if (expiryTime == null) {
                        throw new InvalidOtpException(
                                        MessageConstants.OTP_NOT_FOUND);
                }

                // Check expiry
                if (expiryTime.isBefore(LocalDateTime.now())) {

                        otpStorage.remove(key);
                        otpExpiryStorage.remove(key);

                        throw new InvalidOtpException(
                                        MessageConstants.OTP_EXPIRED);
                }

                // Compare Java-generated OTP with user-entered OTP
                if (!savedOtp.equals(request.getOtp())) {

                        throw new InvalidOtpException(
                                        MessageConstants.INVALID_OTP);
                }

                // OTP successfully verified
                return new ApiResponse<>(
                                true,
                                MessageConstants.OTP_VERIFIED_SUCCESS,
                                null);
        }

        // **With Twilio/MSG91 Verify, Twilio/MSG91 generates, sends, and verifies the
        // mobile OTP,
        // ** while Java handles the email OTP. At that time, uncomment this code.

        // @Override
        // public ApiResponse verifyOtp(VerifyOtpRequest request) {
        //
        // // =========================
        // // Mobile OTP - Twilio Verify
        // // =========================
        // if (request.getMobileNumber() != null
        // && !request.getMobileNumber().isBlank()) {
        //
        // boolean verified = smsService.verifyOtp(
        // "+91" + request.getMobileNumber(),
        // request.getOtp()
        // );
        //
        // if (!verified) {
        // throw new InvalidOtpException(
        // MessageConstants.INVALID_OTP
        // );
        // }
        //
        // return new ApiResponse<>(
        // true,
        // MessageConstants.OTP_VERIFIED_SUCCESS,
        // null
        // );
        // }
        //
        // // =========================
        // // Email OTP - Java verification
        // // =========================
        // if (request.getEmail() != null
        // && !request.getEmail().isBlank()) {
        //
        // String key = request.getEmail();
        //
        // // OTP generated and stored by Java
        // String savedOtp = otpStorage.get(key);
        //
        // if (savedOtp == null) {
        // throw new InvalidOtpException(
        // MessageConstants.OTP_NOT_FOUND
        // );
        // }
        //
        // // Get expiry time
        // LocalDateTime expiryTime =
        // otpExpiryStorage.get(key);
        //
        // if (expiryTime == null) {
        // throw new InvalidOtpException(
        // MessageConstants.OTP_NOT_FOUND
        // );
        // }
        //
        // // Check expiry
        // if (expiryTime.isBefore(LocalDateTime.now())) {
        //
        // otpStorage.remove(key);
        // otpExpiryStorage.remove(key);
        //
        // throw new InvalidOtpException(
        // MessageConstants.OTP_EXPIRED
        // );
        // }
        //
        // // Compare Java-generated OTP
        // if (!savedOtp.equals(request.getOtp())) {
        //
        // throw new InvalidOtpException(
        // MessageConstants.INVALID_OTP
        // );
        // }
        //
        // // OTP successfully verified
        // otpStorage.remove(key);
        // otpExpiryStorage.remove(key);
        //
        // return new ApiResponse<>(
        // true,
        // MessageConstants.OTP_VERIFIED_SUCCESS,
        // null
        // );
        // }
        //
        // // Neither mobile nor email provided
        // throw new InvalidOtpException(
        // MessageConstants.OTP_NOT_FOUND
        // );
        // }

        @Override
        public ApiResponse<String> resetPassword(ResetPasswordRequest request) {

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UserNotFoundException(
                                                MessageConstants.USER_NOT_FOUND));

                String savedOtp = otpStorage.get(request.getEmail());

                if (savedOtp == null) {

                        throw new InvalidOtpException(
                                        MessageConstants.OTP_NOT_FOUND);

                }

                LocalDateTime expiryTime = otpExpiryStorage.get(request.getEmail());

                if (expiryTime == null) {

                        throw new InvalidOtpException(
                                        MessageConstants.OTP_NOT_FOUND);

                }

                if (expiryTime.isBefore(LocalDateTime.now())) {

                        otpStorage.remove(request.getEmail());
                        otpExpiryStorage.remove(request.getEmail());

                        throw new InvalidOtpException(
                                        MessageConstants.OTP_EXPIRED);

                }

                if (!savedOtp.equals(request.getOtp())) {

                        throw new InvalidOtpException(
                                        MessageConstants.INVALID_OTP);

                }

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getNewPassword()));

                userRepository.save(user);

                otpStorage.remove(request.getEmail());

                otpExpiryStorage.remove(request.getEmail());

                auditService.saveAuditLog(
                                user.getEmail(),
                                "RESET_PASSWORD",
                                "Password reset successfully",
                                null,
                                "SUCCESS");

                return new ApiResponse<>(
                                true,
                                MessageConstants.PASSWORD_RESET_SUCCESS,
                                null);

        }

        @Override
        public ApiResponse<ProfileResponse> editProfile(EditProfileRequest request,
                        String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                MessageConstants.USER_NOT_FOUND));

                user.setFullName(request.getFullName());
                user.setMobileNumber(request.getMobileNumber());
                user.setGender(request.getGender());
                user.setState(request.getState());
                user.setCountry(request.getCountry());

                user.setUpdatedBy(email);

                if (request.getProfilePicture() != null
                                && !request.getProfilePicture().isEmpty()) {

                        MultipartFile file = request.getProfilePicture();

                        String originalFileName = file.getOriginalFilename();

                        String fileName = System.currentTimeMillis()
                                        + "_" + originalFileName;
                        Path uploadPath = Paths.get("uploads/profile");

                        try {

                                if (!Files.exists(uploadPath)) {
                                        Files.createDirectories(uploadPath);
                                }

                                Path filePath = uploadPath.resolve(fileName);
                                Files.copy(
                                                file.getInputStream(),
                                                filePath,
                                                StandardCopyOption.REPLACE_EXISTING);

                                String imagePath = "/uploads/profile/" + fileName;
                                user.setProfilePicture(imagePath);

                        } catch (IOException e) {

                                throw new RuntimeException(
                                                "Failed to save profile picture", e);
                        }
                }
                User updatedUser = userRepository.save(user);

                ProfileResponse response = new ProfileResponse();

                response.setUserId(updatedUser.getUserId());
                response.setFullName(updatedUser.getFullName());
                response.setEmail(updatedUser.getEmail());
                response.setMobileNumber(updatedUser.getMobileNumber());
                response.setGender(updatedUser.getGender());
                response.setState(updatedUser.getState());
                response.setCountry(updatedUser.getCountry());
                response.setProfilePicture(updatedUser.getProfilePicture());

                auditService.saveAuditLog(
                                user.getEmail(),
                                "EDIT_PROFILE",
                                "Profile updated successfully",
                                null,
                                "SUCCESS");

                return new ApiResponse<>(
                                true,
                                MessageConstants.PROFILE_UPDATED,
                                response);
        }

        @Override
        public ApiResponse<String> changePassword(ChangePasswordRequest request,
                        String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                MessageConstants.USER_NOT_FOUND));

                if (!passwordEncoder.matches(
                                request.getCurrentPassword(),
                                user.getPassword())) {

                        throw new PasswordMismatchException(
                                        MessageConstants.INVALID_CURRENT_PASSWORD);

                }

                if (!request.getNewPassword()
                                .equals(request.getConfirmPassword())) {

                        throw new PasswordMismatchException(
                                        MessageConstants.PASSWORD_MISMATCH);

                }

                if (passwordEncoder.matches(
                                request.getNewPassword(),
                                user.getPassword())) {

                        throw new PasswordMismatchException(
                                        MessageConstants.NEW_PASSWORD_SAME_AS_OLD);

                }

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getNewPassword()));

                userRepository.save(user);

                emailService.sendPasswordChangedMail(
                                user.getEmail(),
                                user.getFullName());

                auditService.saveAuditLog(
                                user.getEmail(),
                                "CHANGE_PASSWORD",
                                "Password changed successfully",
                                null,
                                "SUCCESS");

                return new ApiResponse<>(
                                true,
                                MessageConstants.PASSWORD_CHANGED_SUCCESS,
                                null);

        }

        @Override
        public ApiResponse<ProfileResponse> getProfile(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                ProfileResponse response = new ProfileResponse();

                response.setUserId(user.getUserId());
                response.setFullName(user.getFullName());
                response.setEmail(user.getEmail());
                response.setMobileNumber(user.getMobileNumber());
                response.setGender(user.getGender());
                response.setState(user.getState());
                response.setCountry(user.getCountry());

                // If profile picture exists
                response.setProfilePicture(user.getProfilePicture());

                return new ApiResponse<>(
                                true,
                                "Profile fetched successfully",
                                response);
        }

}
