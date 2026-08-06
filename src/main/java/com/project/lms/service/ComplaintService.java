package com.project.lms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.lms.dto.ComplaintRequest;
import com.project.lms.dto.ComplaintResponse;
import com.project.lms.entity.Complaint;
import com.project.lms.entity.ComplaintStatus;
import com.project.lms.entity.Role;
import com.project.lms.entity.User;
import com.project.lms.exception.BadRequestException;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.ComplaintRepository;
import com.project.lms.repository.UserRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            UserRepository userRepository) {

        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    /*
     * =====================================
     * CREATE COMPLAINT
     * =====================================
     */

    public ComplaintResponse createComplaint(ComplaintRequest request) {

        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() != Role.STUDENT) {
            throw new BadRequestException(
                    "Only students can raise complaints");
        }

        Complaint complaint = Complaint.builder()
                .user(currentUser)
                .subject(request.getSubject().trim())
                .description(request.getDescription().trim())
                .status(ComplaintStatus.PENDING)
                .build();

        Complaint savedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(savedComplaint);
    }

    /*
     * =====================================
     * GET ALL COMPLAINTS (ADMIN)
     * =====================================
     */

    public List<ComplaintResponse> getAllComplaints() {
        return getAllComplaints(null, null);
    }

    public List<ComplaintResponse> getAllComplaints(
            String search,
            ComplaintStatus status) {

        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() == Role.STUDENT) {
            throw new BadRequestException(
                    "Students cannot access all complaints");
        }

        String normalizedSearch = (search == null || search.isBlank())
                ? ""
                : search.trim();

        return complaintRepository.searchByStatusAndSearch(
                        status,
                        normalizedSearch)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /*
     * =====================================
     * GET MY COMPLAINTS
     * =====================================
     */

    public List<ComplaintResponse> getMyComplaints() {

        User currentUser = resolveCurrentUser();

        return complaintRepository
                .findByUser_Id(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /*
     * =====================================
     * GET COMPLAINT BY ID
     * =====================================
     */

    public ComplaintResponse getComplaintById(Integer complaintId) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Complaint not found"));

        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() == Role.STUDENT &&
                !complaint.getUser().getId().equals(currentUser.getId())) {

            throw new BadRequestException(
                    "You cannot access this complaint");
        }

        return mapToResponse(complaint);
    }

    /*
     * =====================================
     * GET COMPLAINTS BY STATUS
     * =====================================
     */

    public List<ComplaintResponse> getComplaintsByStatus(
            ComplaintStatus status) {

        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() == Role.STUDENT) {
            throw new BadRequestException(
                    "Students cannot filter all complaints");
        }

        return complaintRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

        /*
     * =====================================
     * UPDATE COMPLAINT STATUS
     * =====================================
     */

    public ComplaintResponse updateStatus(
            Integer complaintId,
            ComplaintStatus status) {

        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() == Role.STUDENT) {
            throw new BadRequestException(
                    "Students cannot update complaint status");
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found"));

        complaint.setStatus(status);

        Complaint updatedComplaint = complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }

    /*
     * =====================================
     * DELETE COMPLAINT
     * =====================================
     */

    public void deleteComplaint(Integer complaintId) {

        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException(
                    "Only admin can delete complaints");
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found"));

        complaintRepository.delete(complaint);
    }

    /*
     * =====================================
     * GET CURRENT LOGGED-IN USER
     * =====================================
     */

    private User resolveCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Authentication required");
        }

        String email = authentication.getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    /*
     * =====================================
     * ENTITY -> DTO
     * =====================================
     */

    private ComplaintResponse mapToResponse(Complaint complaint) {

        return ComplaintResponse.builder()
                .complaintId(complaint.getComplaintId())
                .userId(complaint.getUser().getId())
                .userName(complaint.getUser().getFullName())
                .subject(complaint.getSubject())
                .description(complaint.getDescription())
                .status(complaint.getStatus().name())
                .createdAt(complaint.getCreatedAt())
                .build();
    }
}