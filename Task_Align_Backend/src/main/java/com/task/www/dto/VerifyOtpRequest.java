package com.task.www.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyOtpRequest {

	@Email(message = "Invalid Email Address")
	private String email;

	@Pattern(regexp = "^[6-9][0-9]{9}$", message = "Mobile Number must contain exactly 10 digits")
	private String mobileNumber;

	@NotBlank(message = "OTP is Required")
	@Pattern(regexp = "^[0-9]{6}$", message = "OTP must be 6 digits")
	private String otp;

}
