package com.task.www.dto;

import com.task.www.enums.Gender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

	@NotBlank(message = "Full Name is required")
	@Size(min = 2, max = 50, message = "Full Name must be between 2 and 50 characters")
	@Pattern(regexp = "^[A-Za-z]+(?: [A-Za-z]+)*$", message = "Full Name must contain letters and single spaces only")
	private String fullName;

	@NotBlank(message = "Email Address is required")
	@Size(max = 254, message = "Email Address cannot exceed 254 characters")
	@Pattern(regexp = "^(?!\\.)(?!.*\\.\\.)[A-Za-z0-9._+-]+@[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\\.[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*\\.[A-Za-z]{2,}$", message = "Enter a valid email address")
	private String email;

	@NotBlank(message = "Mobile Number is required")
	@Pattern(regexp = "^[6-9][0-9]{9}$", message = "Mobile Number must be exactly 10 digits starting with 6, 7, 8, or 9")
	private String mobileNumber;

	@NotNull(message = "Gender is required")
	private Gender gender;

	@NotBlank(message = "State is required")
	private String state;

	@NotBlank(message = "Country is required")
	private String country;

	@NotBlank(message = "Password is required")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?])\\S{8,64}$", message = "Password must be between 8 and 64 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character with no spaces")
	private String password;

	@NotBlank(message = "Confirm Password is required")
	private String confirmPassword;

}

