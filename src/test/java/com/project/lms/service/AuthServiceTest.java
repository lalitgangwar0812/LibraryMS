package com.project.lms.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project.lms.dto.LoginRequest;
import com.project.lms.dto.LoginResponse;
import com.project.lms.dto.ProfileUpdateRequest;
import com.project.lms.dto.RegisterRequest;
import com.project.lms.entity.Role;
import com.project.lms.repository.UserRepository;
import com.project.lms.security.CustomUserDetailsService;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerNormalizesEmailAndCreatesStudentAccount() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Jane Doe");
        request.setEmail(" Jane.Doe@Example.COM ");
        request.setPhoneNumber("0712345678");
        request.setPassword("password");
        request.setConfirmPassword("password");

        when(userRepository.existsByEmailIgnoreCase("jane.doe@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");

        authService.register(request);

        ArgumentCaptor<com.project.lms.entity.User> userCaptor =
                ArgumentCaptor.forClass(com.project.lms.entity.User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("jane.doe@example.com", userCaptor.getValue().getEmail());
        assertEquals(Role.STUDENT, userCaptor.getValue().getRole());
        assertNotEquals("password", userCaptor.getValue().getPassword());
    }

    @Test
    void loginAuthenticatesAndReturnsJwtForEnabledUser() {
        com.project.lms.entity.User account = com.project.lms.entity.User.builder()
                .id(1)
                .email("jane@example.com")
                .password("encoded-password")
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        LoginRequest request = new LoginRequest();
        request.setEmail("Jane@Example.com");
        request.setPassword("password");

        when(userRepository.findByEmailIgnoreCase("Jane@Example.com"))
                .thenReturn(Optional.of(account));
        when(userDetailsService.loadUserByUsername("jane@example.com"))
                .thenReturn(User.withUsername("jane@example.com")
                        .password("encoded-password")
                        .roles("STUDENT")
                        .build());
        when(jwtService.generateToken(any())).thenReturn("jwt-token");

        LoginResponse response = authService.login(request);

        verify(authenticationManager).authenticate(any());
        verify(jwtService).generateToken(any());
        assertEquals("jwt-token", response.getToken());
        assertEquals("STUDENT", response.getRole());
    }

    @Test
    void updateProfilePersistsStudentNameAndPhoneNumber() {
        com.project.lms.entity.User account = com.project.lms.entity.User.builder()
                .id(7)
                .fullName("Jane Doe")
                .email("jane@example.com")
                .phoneNumber("0712345678")
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setFullName("Jane Smith");
        request.setPhoneNumber("0712349876");

        when(userRepository.findByEmailIgnoreCase("jane@example.com")).thenReturn(Optional.of(account));
        when(userRepository.save(any(com.project.lms.entity.User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.updateProfile(request, "jane@example.com");

        verify(userRepository).save(any(com.project.lms.entity.User.class));
        assertEquals("Jane Smith", account.getFullName());
        assertEquals("0712349876", account.getPhoneNumber());
    }
}
