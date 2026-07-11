package com.project.lms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.lms.dto.ComplaintRequest;
import com.project.lms.dto.ComplaintResponse;
import com.project.lms.entity.Complaint;
import com.project.lms.entity.ComplaintStatus;
import com.project.lms.entity.User;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.ComplaintRepository;
import com.project.lms.repository.UserRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(ComplaintRepository complaintRepository,
                            UserRepository userRepository) {

        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    // Create Complaint
    public ComplaintResponse createComplaint(ComplaintRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Complaint complaint = Complaint.builder()
                .user(user)
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(ComplaintStatus.PENDING)
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);

        return mapToResponse(savedComplaint);
    }

    // Get All Complaints
    public List<ComplaintResponse> getAllComplaints() {

        return complaintRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Complaint By ID
    public ComplaintResponse getComplaintById(Integer id) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found"));

        return mapToResponse(complaint);
    }

    // Get Complaints By User
    public List<ComplaintResponse> getComplaintsByUser(Integer userId) {

        return complaintRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update Complaint Status
    public ComplaintResponse updateStatus(
            Integer complaintId,
            ComplaintStatus status) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found"));

        complaint.setStatus(status);

        Complaint updatedComplaint = complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }

    // Entity -> DTO
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