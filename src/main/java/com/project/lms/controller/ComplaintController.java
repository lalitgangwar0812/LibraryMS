package com.project.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.lms.dto.ComplaintRequest;
import com.project.lms.dto.ComplaintResponse;
import com.project.lms.entity.ComplaintStatus;
import com.project.lms.service.ComplaintService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/complaints")
@Validated
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // Create Complaint
    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody ComplaintRequest request) {

        return new ResponseEntity<>(
                complaintService.createComplaint(request),
                HttpStatus.CREATED);
    }

    // Get All Complaints
    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {

        return ResponseEntity.ok(
                complaintService.getAllComplaints());
    }

    // Get Complaint By ID
    @GetMapping("/{complaintId}")
    public ResponseEntity<ComplaintResponse> getComplaintById(
            @PathVariable Integer complaintId) {

        return ResponseEntity.ok(
                complaintService.getComplaintById(complaintId));
    }

    // Get Complaints By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                complaintService.getComplaintsByUser(userId));
    }

    // Update Complaint Status
    @PutMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Integer complaintId,
            @RequestParam ComplaintStatus status) {

        return ResponseEntity.ok(
                complaintService.updateStatus(complaintId, status));
    }
}