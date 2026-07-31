package com.project.lms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.lms.dto.ProfileResponse;
import com.project.lms.dto.ProfileUpdateRequest;
import com.project.lms.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/student/profile")
@Validated
public class StudentProfileController {

    private final AuthService authService;

    public StudentProfileController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        return ResponseEntity.ok(authService.getCurrentProfile());
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(authService.updateProfile(request, authService.getCurrentProfile().getEmail()));
    }
}
