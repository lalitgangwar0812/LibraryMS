package com.project.lms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LibrarianStatusRequest {
    @NotNull(message = "Enabled status is required")
    private Boolean enabled;
}
