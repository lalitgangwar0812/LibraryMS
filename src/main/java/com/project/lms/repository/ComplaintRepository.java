package com.project.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.Complaint;
import com.project.lms.entity.ComplaintStatus;

public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {

    // All complaints of a user
    List<Complaint> findByUser_Id(Integer userId);

    // Filter by status
    List<Complaint> findByStatus(ComplaintStatus status);

    // User complaints by status
    List<Complaint> findByUser_IdAndStatus(
            Integer userId,
            ComplaintStatus status);

    long countByStatus(ComplaintStatus status);

}