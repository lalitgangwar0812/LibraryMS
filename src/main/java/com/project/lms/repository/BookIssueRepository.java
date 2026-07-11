package com.project.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.BookIssue;
import com.project.lms.entity.IssueStatus;

public interface BookIssueRepository extends JpaRepository<BookIssue, Integer> {

    // Get all issues of a user
    List<BookIssue> findByUser_Id(Integer userId);

    // Get all issues of a book
    List<BookIssue> findByBook_BookId(Integer bookId);

    // Get by status
    List<BookIssue> findByStatus(IssueStatus status);

    // Get all active issues of a user
    List<BookIssue> findByUser_IdAndStatus(
            Integer userId,
            IssueStatus status);

    // Check if user already has this book issued
    boolean existsByUser_IdAndBook_BookIdAndStatus(
            Integer userId,
            Integer bookId,
            IssueStatus status);


    long countByStatus(IssueStatus status);
}