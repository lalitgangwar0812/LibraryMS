package com.project.lms.service;

import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.lms.dto.LibrarianRequest;
import com.project.lms.dto.LibrarianResponse;
import com.project.lms.entity.Role;
import com.project.lms.entity.User;
import com.project.lms.exception.BadRequestException;
import com.project.lms.exception.DuplicateResourceException;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.NewsRepository;
import com.project.lms.repository.UserRepository;

@Service
@PreAuthorize("hasRole('ADMIN')")
public class AdminLibrarianService {

    private final UserRepository userRepository;
    private final NewsRepository newsRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminLibrarianService(UserRepository userRepository,
                                 NewsRepository newsRepository,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.newsRepository = newsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Page<LibrarianResponse> getLibrarians(String search, Pageable pageable) {
        String term = search == null || search.isBlank() ? "" : search.trim();
        return userRepository.searchByRole(Role.LIBRARIAN, term, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public LibrarianResponse getLibrarian(Integer id) {
        return mapToResponse(findLibrarian(id));
    }

    @Transactional
    public LibrarianResponse createLibrarian(LibrarianRequest request) {
        validatePasswordForCreate(request);
        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("Email already exists");
        }

        User librarian = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .phoneNumber(request.getPhoneNumber().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.LIBRARIAN)
                .enabled(true)
                .build();

        return mapToResponse(userRepository.save(librarian));
    }

    @Transactional
    public LibrarianResponse updateLibrarian(Integer id, LibrarianRequest request) {
        User librarian = findLibrarian(id);
        String email = normalizeEmail(request.getEmail());

        if (!librarian.getEmail().equalsIgnoreCase(email)
                && userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("Email already exists");
        }

        validatePasswordForUpdate(request);
        librarian.setFullName(request.getFullName().trim());
        librarian.setEmail(email);
        librarian.setPhoneNumber(request.getPhoneNumber().trim());
        if (hasPassword(request)) {
            librarian.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToResponse(userRepository.save(librarian));
    }

    @Transactional
    public LibrarianResponse updateStatus(Integer id, boolean enabled) {
        User librarian = findLibrarian(id);
        librarian.setEnabled(enabled);
        return mapToResponse(userRepository.save(librarian));
    }

    @Transactional
    public void deleteLibrarian(Integer id) {
        User librarian = findLibrarian(id);
        if (newsRepository.existsByPostedBy_Id(id)) {
            throw new BadRequestException("Cannot delete librarian because associated news records exist");
        }
        userRepository.delete(librarian);
    }

    private User findLibrarian(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Librarian not found"));
        if (user.getRole() != Role.LIBRARIAN) {
            throw new ResourceNotFoundException("Librarian not found");
        }
        return user;
    }

    private void validatePasswordForCreate(LibrarianRequest request) {
        if (!hasPassword(request)) {
            throw new BadRequestException("Password is required");
        }
        validatePasswordsMatch(request);
    }

    private void validatePasswordForUpdate(LibrarianRequest request) {
        if (hasPassword(request)) {
            validatePasswordsMatch(request);
        } else if (request.getConfirmPassword() != null && !request.getConfirmPassword().isBlank()) {
            throw new BadRequestException("Password is required when confirming a password");
        }
    }

    private void validatePasswordsMatch(LibrarianRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
    }

    private boolean hasPassword(LibrarianRequest request) {
        return request.getPassword() != null && !request.getPassword().isBlank();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private LibrarianResponse mapToResponse(User librarian) {
        return LibrarianResponse.builder()
                .id(librarian.getId())
                .fullName(librarian.getFullName())
                .email(librarian.getEmail())
                .phoneNumber(librarian.getPhoneNumber())
                .enabled(librarian.isEnabled())
                .build();
    }
}
