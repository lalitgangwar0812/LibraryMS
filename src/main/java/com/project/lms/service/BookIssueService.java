package com.project.lms.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Comparator;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import com.project.lms.dto.BookIssueRequest;
import com.project.lms.dto.BookIssueResponse;
import com.project.lms.dto.StudentResponse;
import com.project.lms.entity.Book;
import com.project.lms.entity.BookIssue;
import com.project.lms.entity.IssueStatus;
import com.project.lms.entity.Role;
import com.project.lms.entity.User;
import com.project.lms.exception.BadRequestException;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.BookIssueRepository;
import com.project.lms.repository.BookRepository;
import com.project.lms.repository.UserRepository;

@Service
public class BookIssueService {

    private final BookIssueRepository bookIssueRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookIssueService(BookIssueRepository bookIssueRepository,
                            BookRepository bookRepository,
                            UserRepository userRepository) {

        this.bookIssueRepository = bookIssueRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    // Issue Book
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public BookIssueResponse issueBook(BookIssueRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.STUDENT) {
            throw new BadRequestException("Books can only be issued to students");
        }

        if (!user.isEnabled()) {
            throw new BadRequestException("Cannot issue a book to a disabled student");
        }

        if (!request.getDueDate().isAfter(LocalDate.now())) {
            throw new BadRequestException("Due date must be in the future");
        }

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found"));

        if (book.getAvailableQuantity() <= 0) {
            throw new BadRequestException("Book is not available");
        }

        if (bookIssueRepository.existsByUser_IdAndBook_BookIdAndStatus(
                request.getUserId(),
                request.getBookId(),
                IssueStatus.ISSUED)) {

            throw new BadRequestException("Book already issued to this user");
        }

        BookIssue issue = BookIssue.builder()
                .user(user)
                .book(book)
                .issueDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .status(IssueStatus.ISSUED)
                .build();

        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        BookIssue savedIssue = bookIssueRepository.save(issue);

        return mapToResponse(savedIssue);
    }

    // Return Book
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public BookIssueResponse returnBook(Integer issueId) {

        BookIssue issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Issue record not found"));

        if (issue.getStatus() == IssueStatus.RETURNED) {
            throw new BadRequestException("Book already returned");
        }

        issue.setReturnDate(LocalDate.now());
        issue.setStatus(IssueStatus.RETURNED);

        Book book = issue.getBook();
        book.setAvailableQuantity(Math.min(book.getQuantity(), book.getAvailableQuantity() + 1));

        bookRepository.save(book);

        BookIssue updatedIssue = bookIssueRepository.save(issue);

        return mapToResponse(updatedIssue);
    }

    // Get All Issues
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public List<BookIssueResponse> getAllIssues(String search, String status) {

        String normalizedSearch = search == null ? "" : search.trim().toLowerCase();
        String normalizedStatus = status == null ? "" : status.trim().toUpperCase();

        if (!normalizedStatus.isEmpty()
                && !normalizedStatus.equals(IssueStatus.ISSUED.name())
                && !normalizedStatus.equals(IssueStatus.RETURNED.name())
                && !normalizedStatus.equals("OVERDUE")) {
            throw new BadRequestException("Status must be ISSUED, RETURNED, or OVERDUE");
        }

        return bookIssueRepository.findAllByOrderByIssueDateDesc()
                .stream()
                .filter(issue -> matchesSearch(issue, normalizedSearch))
                .filter(issue -> matchesStatus(issue, normalizedStatus))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public List<StudentResponse> getIssuableStudents() {
        return userRepository.findByRole(Role.STUDENT)
                .stream()
                .sorted(Comparator.comparing(User::getFullName, String.CASE_INSENSITIVE_ORDER))
                .map(student -> StudentResponse.builder()
                        .id(student.getId())
                        .fullName(student.getFullName())
                        .email(student.getEmail())
                        .enabled(student.isEnabled())
                        .role(Role.STUDENT.name())
                        .build())
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    @Transactional(readOnly = true)
    public StudentResponse getStudentForCirculation(Integer studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new ResourceNotFoundException("Student not found");
        }

        List<BookIssueResponse> history = bookIssueRepository.findByUser_Id(studentId)
                .stream()
                .map(this::mapToResponse)
                .sorted(Comparator.comparing(BookIssueResponse::getIssueDate).reversed())
                .collect(Collectors.toList());

        return StudentResponse.builder()
                .id(student.getId())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .phoneNumber(student.getPhoneNumber())
                .role(Role.STUDENT.name())
                .enabled(student.isEnabled())
                .borrowCount(history.size())
                .borrowHistory(history)
                .build();
    }

    // Get Issue By ID
    @Transactional(readOnly = true)
    public BookIssueResponse getIssueById(Integer id) {

        BookIssue issue = bookIssueRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Issue record not found"));

        return mapToResponse(issue);
    }

    // Get Issues By User
    @Transactional(readOnly = true)
    public List<BookIssueResponse> getIssuesByUser(Integer userId) {

        return bookIssueRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookIssueResponse> getIssuesForCurrentUser() {

        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students can access their own issued books");
        }

        return bookIssueRepository.findByUser_IdOrderByIssueDateDesc(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Issues By Book
    @Transactional(readOnly = true)
    public List<BookIssueResponse> getIssuesByBook(Integer bookId) {

        return bookIssueRepository.findByBook_BookId(bookId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Entity -> DTO
    private BookIssueResponse mapToResponse(BookIssue issue) {

        return BookIssueResponse.builder()
                .issueId(issue.getIssueId())
                .userId(issue.getUser().getId())
                .userName(issue.getUser().getFullName())
                .bookId(issue.getBook().getBookId())
                .bookTitle(issue.getBook().getTitle())
                .issueDate(issue.getIssueDate())
                .dueDate(issue.getDueDate())
                .returnDate(issue.getReturnDate())
                .status(issue.getStatus().name())
                .overdue(isOverdue(issue))
                .build();
    }

    private boolean matchesSearch(BookIssue issue, String search) {
        return search.isEmpty()
                || issue.getUser().getFullName().toLowerCase().contains(search)
                || issue.getBook().getTitle().toLowerCase().contains(search);
    }

    private boolean matchesStatus(BookIssue issue, String status) {
        if (status.isEmpty()) {
            return true;
        }
        if (status.equals("OVERDUE")) {
            return isOverdue(issue);
        }
        if (status.equals(IssueStatus.ISSUED.name())) {
            return issue.getStatus() == IssueStatus.ISSUED && !isOverdue(issue);
        }
        return issue.getStatus().name().equals(status);
    }

    private boolean isOverdue(BookIssue issue) {
        return issue.getStatus() == IssueStatus.ISSUED
                && issue.getDueDate().isBefore(LocalDate.now());
    }

    private User resolveCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Authentication required");
        }

        String email = authentication.getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
