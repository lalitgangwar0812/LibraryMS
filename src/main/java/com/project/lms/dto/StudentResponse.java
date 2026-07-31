package com.project.lms.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String role;
    private boolean enabled;
    private LocalDate joinedAt;
    private long borrowCount;
    private List<BookIssueResponse> borrowHistory;
}
