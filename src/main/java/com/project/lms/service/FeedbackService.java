package com.project.lms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.lms.dto.FeedbackRequest;
import com.project.lms.dto.FeedbackResponse;
import com.project.lms.entity.Feedback;
import com.project.lms.entity.User;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.FeedbackRepository;
import com.project.lms.repository.UserRepository;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           UserRepository userRepository) {

        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    // Add Feedback
    public FeedbackResponse addFeedback(FeedbackRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Feedback feedback = Feedback.builder()
                .user(user)
                .message(request.getMessage())
                .rating(request.getRating())
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);

        return mapToResponse(savedFeedback);
    }

    // Get All Feedback
    public List<FeedbackResponse> getAllFeedback() {
        return getAllFeedback(null, null);
    }

    public List<FeedbackResponse> getAllFeedback(
            String search,
            Integer rating) {

        String normalizedSearch = (search == null || search.isBlank())
                ? null
                : search.trim();

        return feedbackRepository.searchByRatingAndSearch(
                        rating,
                        normalizedSearch)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Feedback By ID
    public FeedbackResponse getFeedbackById(Integer id) {

        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Feedback not found"));

        return mapToResponse(feedback);
    }

    // Get Feedback By User
    public List<FeedbackResponse> getFeedbackByUser(Integer userId) {

        return feedbackRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Feedback By Rating
    public List<FeedbackResponse> getFeedbackByRating(Integer rating) {

        return feedbackRepository.findByRating(rating)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Entity -> DTO
    private FeedbackResponse mapToResponse(Feedback feedback) {

        return FeedbackResponse.builder()
                .feedbackId(feedback.getFeedbackId())
                .userId(feedback.getUser().getId())
                .userName(feedback.getUser().getFullName())
                .message(feedback.getMessage())
                .rating(feedback.getRating())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}