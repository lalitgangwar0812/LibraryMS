package com.project.lms.dto;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {

    private Integer feedbackId;

    private Integer userId;

    private String userName;

    private String message;

    private Integer rating;

    private LocalDateTime createdAt;
}