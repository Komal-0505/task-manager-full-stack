/*package com.komal.taskmanager.controller;

public class AuthController {
    
}
*/
package com.komal.taskmanager.controller;

import com.komal.taskmanager.entity.User;
import com.komal.taskmanager.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());

        String response = authService.register(user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {

        String response = authService.verifyEmail(
                request.email(),
                request.otp()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
public ResponseEntity<String> login(@RequestBody LoginRequest request) {

    String response = authService.login(
            request.email(),
            request.password()
    );

    return ResponseEntity.ok(response);
}



    public record RegisterRequest(
            String name,
            String email,
            String password
    ) {}

    public record VerifyOtpRequest(
            String email,
            String otp
    ) {}

    public record LoginRequest(
        String email,
        String password
) {}

    
}