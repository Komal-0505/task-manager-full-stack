/*package com.komal.taskmanager.service;

public class EmailService {
    
}
*/

package com.komal.taskmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Task Manager - Email Verification OTP");
        message.setText(
            "Hello,\n\n" +
            "Your OTP for Task Manager email verification is: " + otp +
            "\n\nThis OTP is valid for 5 minutes." +
            "\n\nPlease do not share this OTP with anyone.\n\n" +
            "Thank you,\nTask Manager Team"
        );

        mailSender.send(message);
    }
}