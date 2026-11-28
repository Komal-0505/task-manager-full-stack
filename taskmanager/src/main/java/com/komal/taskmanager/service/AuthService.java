
package com.komal.taskmanager.service;

import com.komal.taskmanager.entity.User;
import com.komal.taskmanager.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            OtpService otpService,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.jwtService = jwtService;
    }

    // Register a new user
    public String register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setVerified(false);

        userRepository.save(user);

        otpService.generateAndSendOtp(user.getEmail());

        return "Registration successful! OTP sent to your email.";
    }

    // Verify email using OTP
    public String verifyEmail(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (user.isVerified()) {
            throw new RuntimeException("Email is already verified!");
        }

        boolean isValid = otpService.verifyOtp(email, otp);

        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP!");
        }

        user.setVerified(true);

        userRepository.save(user);

        return "Email verified successfully!";
    }

    // Login user and generate JWT token
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password!"));

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first!");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }

        return jwtService.generateToken(user.getEmail());
    }
}
