package com.task.www.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String mobileNumber;

    private String profilePicture;

    private String token;

    private String tokenType = "Bearer";

}
