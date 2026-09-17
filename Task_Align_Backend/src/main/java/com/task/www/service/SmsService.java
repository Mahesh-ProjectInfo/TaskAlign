package com.task.www.service;

public interface SmsService {

	//  **When Java generates and verifies the OTP,
    //	uncomment this code and comment out the other OTP code.**
	
	
    void sendOtp(String mobileNumber, String otp);
    
    
//    void sendOtp(String mobileNumber);
//
//    boolean verifyOtp(String mobileNumber, String otp);

}