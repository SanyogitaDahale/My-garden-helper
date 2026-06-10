package com.garden.garden_helper.controller;

import com.garden.garden_helper.entity.User;
import com.garden.garden_helper.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ================= GET USER PROFILE =================

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    // ================= UPDATE USER PROFILE =================

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        user.setSpecialty(updatedUser.getSpecialty());

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }
    
 // ================= UPLOAD AVATAR =================

    @PostMapping("/users/{id}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {

        try {

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Save file name only
            String fileName = file.getOriginalFilename();

            user.setAvatar(fileName);

            userRepository.save(user);

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "message", "Avatar uploaded successfully",
                            "avatar", fileName
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body("Avatar upload failed");
        }
    }

    // ================= CHANGE PASSWORD =================

    @PutMapping("/users/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwords
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentPassword = passwords.get("currentPassword");
        String newPassword = passwords.get("newPassword");

        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest().body("Current password incorrect");
        }

        user.setPassword(newPassword);

        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
    
    @GetMapping("/gardeners")
    public List<User> getGardeners() {

        return userRepository.findByRole("GARDENER");

    }
    
    
}