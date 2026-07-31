package com.project.lms.dto;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsResponse {

    private Integer newsId;

    private String title;

    private String description;

    private Integer postedBy;

    private String postedByName;

    private LocalDateTime createdAt;

    private boolean published;
}