package com.project.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.lms.entity.Complaint;
import com.project.lms.entity.ComplaintStatus;

public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {

    // All complaints of a user
    List<Complaint> findByUser_Id(Integer userId);

    // Filter by status
    List<Complaint> findByStatus(ComplaintStatus status);

    // Filter by status with newest first
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);

    // Search by status and subject or student name
    @Query("""
            SELECT c
            FROM Complaint c
            WHERE (:status IS NULL OR c.status = :status)
              AND (
                    :search = ''
                    OR LOWER(c.subject) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(c.user.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            ORDER BY c.createdAt DESC
            """)
    List<Complaint> searchByStatusAndSearch(
            @Param("status") ComplaintStatus status,
            @Param("search") String search);

    // Search by subject or student name
    List<Complaint> findBySubjectContainingIgnoreCaseOrUser_FullNameContainingIgnoreCase(
            String subject,
            String fullName);

    // All complaints sorted by newest first
    List<Complaint> findAllByOrderByCreatedAtDesc();

    // User complaints by status
    List<Complaint> findByUser_IdAndStatus(
            Integer userId,
            ComplaintStatus status);

    long countByStatus(ComplaintStatus status);

}