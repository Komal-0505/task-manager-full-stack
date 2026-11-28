/*package com.komal.taskmanager.service;

public class OtpService {
    
}
*/

package com.komal.taskmanager.service;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final EmailService emailService;

    private final SecureRandom random = new SecureRandom();

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    private final Map<String, LocalDateTime> expiryStorage = new ConcurrentHashMap<>();

    public OtpService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void generateAndSendOtp(String email) {

        String otp = String.format("%06d", random.nextInt(1000000));

        otpStorage.put(email, otp);

        expiryStorage.put(email, LocalDateTime.now().plusMinutes(5));

        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String enteredOtp) {

        String storedOtp = otpStorage.get(email);

        LocalDateTime expiryTime = expiryStorage.get(email);

        if (storedOtp == null || expiryTime == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(expiryTime)) {
            otpStorage.remove(email);
            expiryStorage.remove(email);
            return false;
        }

        if (storedOtp.equals(enteredOtp)) {
            otpStorage.remove(email);
            expiryStorage.remove(email);
            return true;
        }

        return false;
    }
}