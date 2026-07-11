package com.project.lms.dto;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintResponse {

    private Integer complaintId;

    private Integer userId;

    private String userName;

    private String subject;

    private String description;

    private String status;

    private LocalDateTime createdAt;
}