package com.garden.garden_helper.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.garden.garden_helper.entity.User;
import com.garden.garden_helper.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().isEmpty() ||
            user.getPassword() == null || user.getPassword().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Fields cannot be empty ❌");
        }

        if (userRepository.existsByEmail(user.getEmail())) {

            return ResponseEntity
                    .badRequest()
                    .body("Email already exists ❌");
        }

        String password = user.getPassword();

        // STRONG PASSWORD VALIDATION
        if (password.length() < 8) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must be at least 8 characters ❌");
        }

        if (!password.matches(".*[A-Z].*")) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain 1 uppercase letter ❌");
        }

        if (!password.matches(".*[a-z].*")) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain 1 lowercase letter ❌");
        }

        if (!password.matches(".*[0-9].*")) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain 1 number ❌");
        }

        if (!password.matches(".*[!@#$%^&*].*")) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain 1 special character ❌");
        }

        // DEFAULT ROLE
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        user.setRole(user.getRole().toUpperCase());

        System.out.println("REGISTER ROLE: " + user.getRole());

        userRepository.save(user);

        return ResponseEntity.ok("Registered Successfully");
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().isEmpty() ||
            user.getPassword() == null || user.getPassword().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Fields cannot be empty ❌");
        }

        Optional<User> optionalUser =
                userRepository.findByEmail(user.getEmail());

        if (optionalUser.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("User not found ❌");
        }

        User existingUser = optionalUser.get();

        if (!existingUser.getPassword().equals(user.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid password ❌");
        }

        System.out.println("LOGIN ROLE: " + existingUser.getRole());

        // TEMP TOKEN
        String token =
                "garden-helper-token-" + existingUser.getId();

        return ResponseEntity.ok(java.util.Map.of(

                "token", token,
                "userId", existingUser.getId(),
                "name", existingUser.getName(),
                "email", existingUser.getEmail(),
                "role", existingUser.getRole()
        ));
    }

    // ================= CHANGE PASSWORD =================
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> request
    ) {

        String email = request.get("email");
        String newPassword = request.get("newPassword");

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found ❌");
        }

        // STRONG PASSWORD VALIDATION
        if (newPassword.length() < 8) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must be at least 8 characters ❌");
        }

        if (!newPassword.matches(".*[A-Z].*")) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain 1 uppercase letter ❌");
        }

        if (!newPassword.matches(".*[a-z].*")) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain 1 lowercase letter ❌");
        }

        if (!newPassword.matches(".*[0-9].*")) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain 1 number ❌");
        }

        if (!newPassword.matches(".*[!@#$%^&*].*")) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain 1 special character ❌");
        }

        User user = optionalUser.get();

        user.setPassword(newPassword);

        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully ✅");
    }
}