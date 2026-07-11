package com.project.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.lms.dto.BookIssueRequest;
import com.project.lms.dto.BookIssueResponse;
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

        System.out.println("=================================");
        System.out.println(">>> Book Issue API Hit <<<");
        System.out.println("User ID : " + request.getUserId());
        System.out.println("Book ID : " + request.getBookId());
        System.out.println("Due Date: " + request.getDueDate());
        System.out.println("=================================");

        BookIssueResponse response = bookIssueService.issueBook(request);

        System.out.println("Book issued successfully.");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Return Book
    @PutMapping("/{issueId}/return")
    public ResponseEntity<BookIssueResponse> returnBook(
            @PathVariable Integer issueId) {

        System.out.println(">>> Return Book API Hit <<<");
        System.out.println("Issue ID: " + issueId);

        BookIssueResponse response = bookIssueService.returnBook(issueId);

        System.out.println("Book returned successfully.");

        return ResponseEntity.ok(response);
    }

    // Get All Issued Books
    @GetMapping
    public ResponseEntity<List<BookIssueResponse>> getAllIssues() {

        System.out.println(">>> Get All Issues API Hit <<<");

        return ResponseEntity.ok(bookIssueService.getAllIssues());
    }

    // Get Issue By ID
    @GetMapping("/{issueId}")
    public ResponseEntity<BookIssueResponse> getIssueById(
            @PathVariable Integer issueId) {

        System.out.println(">>> Get Issue By ID API Hit <<<");
        System.out.println("Issue ID: " + issueId);

        return ResponseEntity.ok(bookIssueService.getIssueById(issueId));
    }

    // Get Issues By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookIssueResponse>> getIssuesByUser(
            @PathVariable Integer userId) {

        System.out.println(">>> Get Issues By User API Hit <<<");
        System.out.println("User ID: " + userId);

        return ResponseEntity.ok(bookIssueService.getIssuesByUser(userId));
    }

    // Get Issues By Book
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BookIssueResponse>> getIssuesByBook(
            @PathVariable Integer bookId) {

        System.out.println(">>> Get Issues By Book API Hit <<<");
        System.out.println("Book ID: " + bookId);

        return ResponseEntity.ok(bookIssueService.getIssuesByBook(bookId));
    }
}