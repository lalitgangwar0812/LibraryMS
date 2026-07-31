package com.project.lms.dto;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookIssueResponse {

    private Integer issueId;

    private Integer userId;

    private String userName;

    private Integer bookId;

    private String bookTitle;

    private LocalDate issueDate;

    private LocalDate dueDate;

    private LocalDate returnDate;

    private String status;

    private boolean overdue;
}
