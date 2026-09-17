package com.task.www.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
	
	
	@NotBlank(message = "Email is Required")
	@Email(message = "Invalid Email Address")
	private String email;
	
	@NotBlank(message = "OTP is Required")
	@Pattern(regexp = "^[0-9]{6}$",
	message ="OTP must be 6 digits")
	private String otp;
	
	@NotBlank(message = "Password is Required")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,20}$",
	message = "Password must contain uppercase, lowercase, number and special character")
	private String newPassword;
	
	@NotBlank(message = "confirmPassword is Required")
	private String confirmPassword;

	
}

