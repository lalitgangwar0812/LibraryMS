package com.project.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.lms.dto.BookIssueRequest;
import com.project.lms.dto.BookIssueResponse;
import com.project.lms.dto.StudentResponse;
import com.project.lms.service.BookIssueService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/book-issues")
@Validated
public class BookIssueController {

    private final BookIssueService bookIssueService;

    public BookIssueController(BookIssueService bookIssueService) {
        this.bookIssueService = bookIssueService;
    }

    // Issue Book
    @PostMapping
    public ResponseEntity<BookIssueResponse> issueBook(
            @Valid @RequestBody BookIssueRequest request) {

        BookIssueResponse response = bookIssueService.issueBook(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Return Book
    @PutMapping("/{issueId}/return")
    public ResponseEntity<BookIssueResponse> returnBook(
            @PathVariable Integer issueId) {

        BookIssueResponse response = bookIssueService.returnBook(issueId);

        return ResponseEntity.ok(response);
    }

    // Get All Issued Books
    @GetMapping
    public ResponseEntity<List<BookIssueResponse>> getAllIssues(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(bookIssueService.getAllIssues(search, status));
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentResponse>> getIssuableStudents() {
        return ResponseEntity.ok(bookIssueService.getIssuableStudents());
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<StudentResponse> getStudentForCirculation(@PathVariable Integer studentId) {
        return ResponseEntity.ok(bookIssueService.getStudentForCirculation(studentId));
    }

    // Get Issue By ID
    @GetMapping("/{issueId}")
    public ResponseEntity<BookIssueResponse> getIssueById(
            @PathVariable Integer issueId) {

        return ResponseEntity.ok(bookIssueService.getIssueById(issueId));
    }

    // Get Issues By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookIssueResponse>> getIssuesByUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(bookIssueService.getIssuesByUser(userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookIssueResponse>> getIssuesForCurrentUser() {

        return ResponseEntity.ok(bookIssueService.getIssuesForCurrentUser());
    }

    // Get Issues By Book
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BookIssueResponse>> getIssuesByBook(
            @PathVariable Integer bookId) {

        return ResponseEntity.ok(bookIssueService.getIssuesByBook(bookId));
    }
}
