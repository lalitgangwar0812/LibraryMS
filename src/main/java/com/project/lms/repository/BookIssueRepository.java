package com.project.lms.repository;

import java.util.List;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.BookIssue;
import com.project.lms.entity.IssueStatus;

public interface BookIssueRepository extends JpaRepository<BookIssue, Integer> {

    // Get all issues of a user
    List<BookIssue> findByUser_Id(Integer userId);

    List<BookIssue> findByUser_IdOrderByIssueDateDesc(Integer userId);

    // Get all issues of a book
    List<BookIssue> findByBook_BookId(Integer bookId);

    boolean existsByBook_BookId(Integer bookId);

    // Get by status
    List<BookIssue> findByStatus(IssueStatus status);

    @EntityGraph(attributePaths = {"user", "book"})
    List<BookIssue> findAllByOrderByIssueDateDesc();

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

    long countByStatusAndDueDateBefore(IssueStatus status, LocalDate dueDate);

    long countByIssueDate(LocalDate issueDate);

    long countByReturnDate(LocalDate returnDate);
}
