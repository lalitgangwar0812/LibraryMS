package com.project.lms.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project.lms.dto.LibrarianRequest;
import com.project.lms.dto.LibrarianResponse;
import com.project.lms.entity.Role;
import com.project.lms.entity.User;
import com.project.lms.repository.NewsRepository;
import com.project.lms.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AdminLibrarianServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private NewsRepository newsRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminLibrarianService librarianService;

    @Test
    void createLibrarianAssignsLibrarianRoleAndEncodesPassword() {
        LibrarianRequest request = new LibrarianRequest();
        request.setFullName("Mira Shah");
        request.setEmail("Mira.Shah@Example.com");
        request.setPhoneNumber("0712345678");
        request.setPassword("secure-pass");
        request.setConfirmPassword("secure-pass");
        when(userRepository.existsByEmailIgnoreCase("mira.shah@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secure-pass")).thenReturn("bcrypt-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User librarian = invocation.getArgument(0);
            librarian.setId(9);
            return librarian;
        });

        LibrarianResponse response = librarianService.createLibrarian(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals(Role.LIBRARIAN, userCaptor.getValue().getRole());
        assertEquals("bcrypt-password", userCaptor.getValue().getPassword());
        assertEquals("mira.shah@example.com", response.getEmail());
        assertEquals(9, response.getId());
    }
}
