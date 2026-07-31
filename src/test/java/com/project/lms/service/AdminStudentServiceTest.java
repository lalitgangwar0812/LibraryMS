package com.project.lms.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.lms.dto.StudentResponse;
import com.project.lms.entity.Role;
import com.project.lms.entity.User;
import com.project.lms.repository.BookIssueRepository;
import com.project.lms.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AdminStudentServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookIssueRepository bookIssueRepository;

    @InjectMocks
    private AdminStudentService adminStudentService;

    @Test
    void toggleStudentStatusShouldDisableStudent() {

        User student = User.builder()
                .id(1)
                .fullName("Jane Doe")
                .email("jane@example.com")
                .password("encoded")
                .phoneNumber("0712345678")
                .role(Role.STUDENT)
                .enabled(true)
                .build();

        when(userRepository.findById(1)).thenReturn(Optional.of(student));
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(bookIssueRepository.findByUser_Id(1))
                .thenReturn(Collections.emptyList());

        StudentResponse response =
                adminStudentService.toggleStudentStatus(1);

        assertFalse(response.isEnabled());
        assertEquals(Role.STUDENT.name(), response.getRole());
        assertEquals("Jane Doe", response.getFullName());
    }
}