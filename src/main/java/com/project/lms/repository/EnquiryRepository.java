package com.project.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.Enquiry;
import com.project.lms.entity.EnquiryStatus;

public interface EnquiryRepository extends JpaRepository<Enquiry, Integer> {

    // Get all enquiries of a user
    List<Enquiry> findByUser_Id(Integer userId);

    // Get enquiries by status
    List<Enquiry> findByStatus(EnquiryStatus status);

    // Get enquiries of a user by status
    List<Enquiry> findByUser_IdAndStatus(
            Integer userId,
            EnquiryStatus status);

    // Latest enquiries first
    List<Enquiry> findAllByOrderByCreatedAtDesc();

    long countByStatus(EnquiryStatus status);
}