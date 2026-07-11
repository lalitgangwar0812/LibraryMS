package com.project.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.lms.dto.EnquiryRequest;
import com.project.lms.dto.EnquiryResponse;
import com.project.lms.entity.EnquiryStatus;
import com.project.lms.service.EnquiryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enquiries")
@Validated
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    // Create Enquiry
    @PostMapping
    public ResponseEntity<EnquiryResponse> createEnquiry(
            @Valid @RequestBody EnquiryRequest request) {

        return new ResponseEntity<>(
                enquiryService.createEnquiry(request),
                HttpStatus.CREATED);
    }

    // Get All Enquiries
    @GetMapping
    public ResponseEntity<List<EnquiryResponse>> getAllEnquiries() {

        return ResponseEntity.ok(
                enquiryService.getAllEnquiries());
    }

    // Get Enquiry By ID
    @GetMapping("/{enquiryId}")
    public ResponseEntity<EnquiryResponse> getEnquiryById(
            @PathVariable Integer enquiryId) {

        return ResponseEntity.ok(
                enquiryService.getEnquiryById(enquiryId));
    }

    // Get Enquiries By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EnquiryResponse>> getEnquiriesByUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                enquiryService.getEnquiriesByUser(userId));
    }

    // Get Enquiries By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<EnquiryResponse>> getEnquiriesByStatus(
            @PathVariable EnquiryStatus status) {

        return ResponseEntity.ok(
                enquiryService.getEnquiriesByStatus(status));
    }

    // Update Enquiry Status
    @PutMapping("/{enquiryId}/status")
    public ResponseEntity<EnquiryResponse> updateStatus(
            @PathVariable Integer enquiryId,
            @RequestParam EnquiryStatus status) {

        return ResponseEntity.ok(
                enquiryService.updateStatus(enquiryId, status));
    }
}