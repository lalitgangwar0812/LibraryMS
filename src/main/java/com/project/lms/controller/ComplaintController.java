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

    /*
     * =====================================
     * CREATE COMPLAINT
     * =====================================
     */

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody ComplaintRequest request) {

        return new ResponseEntity<>(
                complaintService.createComplaint(request),
                HttpStatus.CREATED);
    }

    /*
     * =====================================
     * GET ALL COMPLAINTS
     * ADMIN / LIBRARIAN
     * =====================================
     */

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ComplaintStatus status) {

        return ResponseEntity.ok(
                complaintService.getAllComplaints(search, status));
    }

    /*
     * =====================================
     * GET MY COMPLAINTS
     * STUDENT
     * =====================================
     */

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints() {

        return ResponseEntity.ok(
                complaintService.getMyComplaints());
    }

    /*
     * =====================================
     * GET COMPLAINT BY ID
     * =====================================
     */

    @GetMapping("/{complaintId}")
    public ResponseEntity<ComplaintResponse> getComplaintById(
            @PathVariable Integer complaintId) {

        return ResponseEntity.ok(
                complaintService.getComplaintById(complaintId));
    }

    /*
     * =====================================
     * FILTER BY STATUS
     * ADMIN / LIBRARIAN
     * =====================================
     */

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByStatus(
            @PathVariable ComplaintStatus status) {

        return ResponseEntity.ok(
                complaintService.getComplaintsByStatus(status));
    }

    /*
     * =====================================
     * UPDATE STATUS
     * ADMIN / LIBRARIAN
     * =====================================
     */

    @PutMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Integer complaintId,
            @RequestParam ComplaintStatus status) {

        return ResponseEntity.ok(
                complaintService.updateStatus(complaintId, status));
    }

    /*
     * =====================================
     * DELETE COMPLAINT
     * ADMIN
     * =====================================
     */

    @DeleteMapping("/{complaintId}")
    public ResponseEntity<Void> deleteComplaint(
            @PathVariable Integer complaintId) {

        complaintService.deleteComplaint(complaintId);

        return ResponseEntity.noContent().build();
    }
}