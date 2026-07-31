package com.project.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.lms.dto.FeedbackRequest;
import com.project.lms.dto.FeedbackResponse;
import com.project.lms.service.FeedbackService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/feedback")
@Validated
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // Add Feedback
    @PostMapping
    public ResponseEntity<FeedbackResponse> addFeedback(
            @Valid @RequestBody FeedbackRequest request) {

        return new ResponseEntity<>(
                feedbackService.addFeedback(request),
                HttpStatus.CREATED);
    }

    // Get All Feedback
    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer rating) {

        return ResponseEntity.ok(
                feedbackService.getAllFeedback(search, rating));
    }

    // Get Feedback By ID
    @GetMapping("/{feedbackId}")
    public ResponseEntity<FeedbackResponse> getFeedbackById(
            @PathVariable Integer feedbackId) {

        return ResponseEntity.ok(
                feedbackService.getFeedbackById(feedbackId));
    }

    // Get Feedback By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackByUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                feedbackService.getFeedbackByUser(userId));
    }

    // Get Feedback By Rating
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackByRating(
            @PathVariable Integer rating) {

        return ResponseEntity.ok(
                feedbackService.getFeedbackByRating(rating));
    }
}