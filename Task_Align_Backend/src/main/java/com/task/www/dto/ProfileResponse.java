package com.task.www.dto;

import com.task.www.enums.Gender;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String mobileNumber;

    private Gender gender;

    private String state;

    private String country;

    private String profilePicture;

}
