package com.project.lms.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.project.lms.dto.BookIssueResponse;
import com.project.lms.dto.StudentResponse;
import com.project.lms.entity.BookIssue;
import com.project.lms.entity.Role;
import com.project.lms.entity.User;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.BookIssueRepository;
import com.project.lms.repository.UserRepository;

@Service
public class AdminStudentService {

    private final UserRepository userRepository;
    private final BookIssueRepository bookIssueRepository;

    public AdminStudentService(
            UserRepository userRepository,
            BookIssueRepository bookIssueRepository) {

        this.userRepository = userRepository;
        this.bookIssueRepository = bookIssueRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentResponse> getStudents(String search) {

        List<User> students = userRepository.findByRole(Role.STUDENT);

        String term = search == null ? "" : search.toLowerCase();

        return students.stream()
                .filter(student ->
                        term.isBlank()
                                || student.getFullName().toLowerCase().contains(term)
                                || student.getEmail().toLowerCase().contains(term)
                                || student.getPhoneNumber().toLowerCase().contains(term))
                .sorted(Comparator.comparing(User::getFullName, String.CASE_INSENSITIVE_ORDER))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public StudentResponse getStudent(Integer studentId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new ResourceNotFoundException("Student not found");
        }

        return mapToResponse(student);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public StudentResponse toggleStudentStatus(Integer studentId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new ResourceNotFoundException("Student not found");
        }

        student.setEnabled(!student.isEnabled());

        User updatedStudent = userRepository.save(student);

        return mapToResponse(updatedStudent);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteStudent(Integer studentId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new ResourceNotFoundException("Student not found");
        }

        userRepository.delete(student);
    }

    private StudentResponse mapToResponse(User student) {

        List<BookIssue> issues = bookIssueRepository.findByUser_Id(student.getId());

        List<BookIssueResponse> history = issues.stream()
                .map(issue -> BookIssueResponse.builder()
                        .issueId(issue.getIssueId())
                        .userId(issue.getUser().getId())
                        .userName(issue.getUser().getFullName())
                        .bookId(issue.getBook().getBookId())
                        .bookTitle(issue.getBook().getTitle())
                        .issueDate(issue.getIssueDate())
                        .dueDate(issue.getDueDate())
                        .returnDate(issue.getReturnDate())
                        .status(issue.getStatus().name())
                        .build())
                .sorted(Comparator.comparing(
                        BookIssueResponse::getIssueDate,
                        Comparator.nullsLast(Comparator.naturalOrder()))
                        .reversed())
                .collect(Collectors.toList());

        return StudentResponse.builder()
                .id(student.getId())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .phoneNumber(student.getPhoneNumber())
                .role(student.getRole().name())
                .enabled(student.isEnabled())
                .joinedAt(LocalDate.now())
                .borrowCount(history.size())
                .borrowHistory(history)
                .build();
    }
}