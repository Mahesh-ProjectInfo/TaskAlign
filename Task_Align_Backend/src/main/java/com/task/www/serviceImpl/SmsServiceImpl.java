
//  When using the TWILIO SMS service, uncomment this code.  //

//package com.task.www.serviceImpl;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import com.task.www.service.SmsService;
//import com.twilio.Twilio;
//import com.twilio.rest.api.v2010.account.Message;
//import com.twilio.type.PhoneNumber;
//
//import jakarta.annotation.PostConstruct;
//
//@Service
//public class SmsServiceImpl implements SmsService {
//
//    @Value("${twilio.account.sid}")
//    private String accountSid;
//
//    @Value("${twilio.auth.token}")
//    private String authToken;
//
//    @Value("${twilio.phone.number}")
//    private String twilioPhoneNumber;
//
//    @PostConstruct
//    public void initTwilio() {
//
//        Twilio.init(
//                accountSid,
//                authToken
//        );
//    }
//
//    @Override
//    public void sendOtp(String mobileNumber, String otp) {
//
//        String messageBody = "Your Task Align OTP is: "
//                + otp
//                + ". It is valid for 5 minutes.";
//
//        Message message = Message.creator(
//                new PhoneNumber(mobileNumber),
//                new PhoneNumber(twilioPhoneNumber),
//                messageBody
//        ).create();
//
//        System.out.println("Twilio Message SID: " + message.getSid());
//        System.out.println("Twilio Message Status: " + message.getStatus());
//    }
//    }

   //    When using the TWILIO API SMS service, uncomment this code.  //

//package com.task.www.serviceImpl;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import com.task.www.service.SmsService;
//import com.twilio.Twilio;
//import com.twilio.rest.verify.v2.service.Verification;
//import com.twilio.rest.verify.v2.service.VerificationCheck;
//
//import jakarta.annotation.PostConstruct;
//
//@Service
//public class SmsServiceImpl implements SmsService {
//
//    @Value("${twilio.account.sid}")
//    private String accountSid;
//
//    @Value("${twilio.auth.token}")
//    private String authToken;
//
//    @Value("${twilio.verify.service.sid}")
//    private String verifyServiceSid;
//
//    @PostConstruct
//    public void initTwilio() {
//
//        Twilio.init(
//                accountSid,
//                authToken
//        );
//    }
//
//    @Override
//    public void sendOtp(String mobileNumber) {
//
//        Verification verification =
//                Verification.creator(
//                        verifyServiceSid,
//                        mobileNumber,
//                        "sms"
//                ).create();
//
//        System.out.println(
//                "Twilio Verification SID: "
//                        + verification.getSid()
//        );
//
//        System.out.println(
//                "Twilio Verification Status: "
//                        + verification.getStatus()
//        );
//    }
//
//    @Override
//    public boolean verifyOtp(
//            String mobileNumber,
//            String otp) {
//
//    	VerificationCheck verificationCheck =
//    	        VerificationCheck.creator(verifyServiceSid)
//    	                .setTo(mobileNumber)
//    	                .setCode(otp)
//    	                .create();
//
//        System.out.println(
//                "Verification status: "
//                        + verificationCheck.getStatus()
//        );
//
//        return "approved".equalsIgnoreCase(
//                verificationCheck.getStatus()
//        );
//    }
//}

//   When using the MSG91 SMS service, uncomment this code.  //


package com.task.www.serviceImpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.task.www.service.SmsService;

import java.util.HashMap;
import java.util.Map;

@Service
public class SmsServiceImpl implements SmsService {

    @Value("${msg91.auth.key}")
    private String authKey;

    @Value("${msg91.sender.id}")
    private String senderId;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendOtp(String mobileNumber, String otp) {

        String url = "https://api.msg91.com/api/v2/sendsms";

        String messageBody = "Your Task Align OTP is: "
                + otp
                + ". It is valid for 5 minutes.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("authkey", authKey);

        Map<String, Object> sms = new HashMap<>();
        sms.put("message", messageBody);
        sms.put("to", new String[]{mobileNumber});

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("sender", senderId);
        requestBody.put("route", "4");
        requestBody.put("country", "91");
        requestBody.put("sms", new Object[]{sms});

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        String response = restTemplate.postForObject(
                url,
                request,
                String.class
        );

        System.out.println("MSG91 Response: " + response);
    }
}

  

//  **When using the MSG91 OTP API for OTP generation and verification, uncomment this code and comment out the other SMS code.**

//package com.task.www.serviceImpl;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import com.task.www.service.SmsService;
//
//@Service
//public class SmsServiceImpl implements SmsService {
//
//    @Value("${msg91.auth.key}")
//    private String authKey;
//
//    @Value("${msg91.sender.id}")
//    private String senderId;
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    // =========================
//    // SEND OTP
//    // MSG91 generates and sends OTP
//    // =========================
//    @Override
//    public void sendOtp(String mobileNumber) {
//
//        String url =
//                "https://api.msg91.com/api/sendotp.php";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(
//                MediaType.APPLICATION_JSON
//        );
//
//        Map<String, Object> requestBody =
//                new HashMap<>();
//
//        requestBody.put("authkey", authKey);
//        requestBody.put("mobile", mobileNumber);
//        requestBody.put("sender", senderId);
//
//        // IMPORTANT:
//        // Do NOT send otp here.
//        // MSG91 will generate the OTP.
//        requestBody.put(
//                "otp_expiry",
//                5
//        );
//
//        requestBody.put(
//                "otp_length",
//                6
//        );
//
//        HttpEntity<Map<String, Object>> request =
//                new HttpEntity<>(
//                        requestBody,
//                        headers
//                );
//
//        String response =
//                restTemplate.postForObject(
//                        url,
//                        request,
//                        String.class
//                );
//
//        System.out.println(
//                "MSG91 Send OTP Response: "
//                        + response
//        );
//    }
//
//
//    // =========================
//    // VERIFY OTP
//    // MSG91 verifies OTP
//    // =========================
//    @Override
//    public boolean verifyOtp(
//            String mobileNumber,
//            String otp) {
//
//        String url =
//                "https://api.msg91.com/api/verifyRequestOTP.php";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(
//                MediaType.APPLICATION_JSON
//        );
//
//        Map<String, Object> requestBody =
//                new HashMap<>();
//
//        requestBody.put("authkey", authKey);
//        requestBody.put("mobile", mobileNumber);
//        requestBody.put("otp", otp);
//
//        HttpEntity<Map<String, Object>> request =
//                new HttpEntity<>(
//                        requestBody,
//                        headers
//                );
//
//        String response =
//                restTemplate.postForObject(
//                        url,
//                        request,
//                        String.class
//                );
//
//        System.out.println(
//                "MSG91 Verify OTP Response: "
//                        + response
//        );
//
//        return response != null
//                && response.contains("\"type\":\"success\"");
//    }
//}