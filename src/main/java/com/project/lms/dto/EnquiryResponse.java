package com.project.lms.dto;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnquiryResponse {

    private Integer enquiryId;

    private Integer userId;

    private String userName;

    private String subject;

    private String message;

    private String status;

    private LocalDateTime createdAt;
}