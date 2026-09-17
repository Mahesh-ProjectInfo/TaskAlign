package com.task.www.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class MobileLoginRequest {
	
    @NotBlank(message = "Mobile Number is Requried")
    @Pattern(regexp = "^[6-9][0-9]{9}$",
    message = "Mobile Number must contain exactly 10 digits"
    		)
	private String mobileNumber;
    
    
    @NotBlank(message = "Otp is required")
    @Pattern(regexp = "^[0-9]{6}$",
    message = "Please Enter Valid OTP")
	private String otp;

	}

