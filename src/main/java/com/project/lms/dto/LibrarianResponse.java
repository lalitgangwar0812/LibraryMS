package com.project.lms.dto;

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
public class LibrarianResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private boolean enabled;
}
