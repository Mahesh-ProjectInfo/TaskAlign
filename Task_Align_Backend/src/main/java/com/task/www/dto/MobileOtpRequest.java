package com.task.www.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MobileOtpRequest {

    @NotBlank
    @Pattern(regexp = "^[6-9][0-9]{9}$")
    private String mobileNumber;

}
