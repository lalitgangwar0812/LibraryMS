package com.project.lms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.lms.dto.EnquiryRequest;
import com.project.lms.dto.EnquiryResponse;
import com.project.lms.entity.Enquiry;
import com.project.lms.entity.EnquiryStatus;
import com.project.lms.entity.User;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.EnquiryRepository;
import com.project.lms.repository.UserRepository;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final UserRepository userRepository;

    public EnquiryService(EnquiryRepository enquiryRepository,
                          UserRepository userRepository) {

        this.enquiryRepository = enquiryRepository;
        this.userRepository = userRepository;
    }

    // Create Enquiry
    public EnquiryResponse createEnquiry(EnquiryRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Enquiry enquiry = Enquiry.builder()
                .user(user)
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(EnquiryStatus.OPEN)
                .build();

        Enquiry savedEnquiry = enquiryRepository.save(enquiry);

        return mapToResponse(savedEnquiry);
    }

    // Get All Enquiries
    public List<EnquiryResponse> getAllEnquiries() {

        return enquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Enquiry By ID
    public EnquiryResponse getEnquiryById(Integer enquiryId) {

        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Enquiry not found"));

        return mapToResponse(enquiry);
    }

    // Get Enquiries By User
    public List<EnquiryResponse> getEnquiriesByUser(Integer userId) {

        return enquiryRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Enquiries By Status
    public List<EnquiryResponse> getEnquiriesByStatus(EnquiryStatus status) {

        return enquiryRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update Status
    public EnquiryResponse updateStatus(
            Integer enquiryId,
            EnquiryStatus status) {

        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Enquiry not found"));

        enquiry.setStatus(status);

        Enquiry updatedEnquiry = enquiryRepository.save(enquiry);

        return mapToResponse(updatedEnquiry);
    }

    // Entity -> DTO
    private EnquiryResponse mapToResponse(Enquiry enquiry) {

        return EnquiryResponse.builder()
                .enquiryId(enquiry.getEnquiryId())
                .userId(enquiry.getUser().getId())
                .userName(enquiry.getUser().getFullName())
                .subject(enquiry.getSubject())
                .message(enquiry.getMessage())
                .status(enquiry.getStatus().name())
                .createdAt(enquiry.getCreatedAt())
                .build();
    }
}