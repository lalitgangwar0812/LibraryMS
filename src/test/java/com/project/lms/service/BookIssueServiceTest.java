package com.project.lms.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.lms.dto.BookIssueRequest;
import com.project.lms.dto.BookIssueResponse;
import com.project.lms.entity.Book;
import com.project.lms.entity.BookIssue;
import com.project.lms.entity.IssueStatus;
import com.project.lms.entity.Role;
import com.project.lms.entity.User;
import com.project.lms.exception.BadRequestException;
import com.project.lms.repository.BookIssueRepository;
import com.project.lms.repository.BookRepository;
import com.project.lms.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class BookIssueServiceTest {

    @Mock
    private BookIssueRepository bookIssueRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookIssueService bookIssueService;

    @Test
    void issueBookDecreasesAvailableQuantityForStudent() {
        User student = User.builder().id(1).fullName("Jane Doe").role(Role.STUDENT).enabled(true).build();
        Book book = Book.builder().bookId(2).title("Clean Code").quantity(3).availableQuantity(2).build();
        BookIssueRequest request = BookIssueRequest.builder().userId(1).bookId(2).dueDate(LocalDate.now().plusDays(7)).build();

        when(userRepository.findById(1)).thenReturn(Optional.of(student));
        when(bookRepository.findById(2)).thenReturn(Optional.of(book));
        when(bookIssueRepository.existsByUser_IdAndBook_BookIdAndStatus(1, 2, IssueStatus.ISSUED)).thenReturn(false);
        when(bookIssueRepository.save(any(BookIssue.class))).thenAnswer(invocation -> {
            BookIssue issue = invocation.getArgument(0);
            issue.setIssueId(10);
            return issue;
        });

        bookIssueService.issueBook(request);

        assertEquals(1, book.getAvailableQuantity());
        ArgumentCaptor<BookIssue> issueCaptor = ArgumentCaptor.forClass(BookIssue.class);
        verify(bookIssueRepository).save(issueCaptor.capture());
        assertEquals(IssueStatus.ISSUED, issueCaptor.getValue().getStatus());
    }

    @Test
    void issueBookRejectsUnavailableBook() {
        User student = User.builder().id(1).role(Role.STUDENT).enabled(true).build();
        Book book = Book.builder().bookId(2).availableQuantity(0).build();
        BookIssueRequest request = BookIssueRequest.builder().userId(1).bookId(2).dueDate(LocalDate.now().plusDays(7)).build();
        when(userRepository.findById(1)).thenReturn(Optional.of(student));
        when(bookRepository.findById(2)).thenReturn(Optional.of(book));

        assertThrows(BadRequestException.class, () -> bookIssueService.issueBook(request));
    }

    @Test
    void returnBookIncreasesAvailabilityAndMarksIssueReturned() {
        User student = User.builder().id(1).fullName("Jane Doe").role(Role.STUDENT).build();
        Book book = Book.builder().bookId(2).title("Clean Code").quantity(3).availableQuantity(1).build();
        BookIssue issue = BookIssue.builder()
                .issueId(10)
                .user(student)
                .book(book)
                .issueDate(LocalDate.now().minusDays(2))
                .dueDate(LocalDate.now().plusDays(5))
                .status(IssueStatus.ISSUED)
                .build();
        when(bookIssueRepository.findById(10)).thenReturn(Optional.of(issue));
        when(bookIssueRepository.save(any(BookIssue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        bookIssueService.returnBook(10);

        assertEquals(IssueStatus.RETURNED, issue.getStatus());
        assertEquals(LocalDate.now(), issue.getReturnDate());
        assertEquals(2, book.getAvailableQuantity());
        verify(bookRepository).save(book);
    }

    @Test
    void getIssuesForCurrentUserReturnsOnlyCurrentUserIssuesSortedByIssueDateDesc() {
        User student = User.builder().id(1).fullName("Jane Doe").email("jane@example.com").role(Role.STUDENT).enabled(true).build();
        User otherStudent = User.builder().id(2).fullName("John Doe").email("john@example.com").role(Role.STUDENT).enabled(true).build();
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(student.getEmail(), null, List.of()));

        BookIssue firstIssue = BookIssue.builder().issueId(10).user(student).book(Book.builder().bookId(2).title("Clean Code").build()).issueDate(LocalDate.now().minusDays(1)).dueDate(LocalDate.now().plusDays(2)).status(IssueStatus.ISSUED).build();
        BookIssue secondIssue = BookIssue.builder().issueId(11).user(student).book(Book.builder().bookId(3).title("Refactoring").build()).issueDate(LocalDate.now().minusDays(4)).dueDate(LocalDate.now().plusDays(3)).status(IssueStatus.ISSUED).build();
        BookIssue otherIssue = BookIssue.builder().issueId(12).user(otherStudent).book(Book.builder().bookId(4).title("Other").build()).issueDate(LocalDate.now().minusDays(2)).dueDate(LocalDate.now().plusDays(5)).status(IssueStatus.ISSUED).build();

        when(userRepository.findByEmailIgnoreCase(student.getEmail())).thenReturn(Optional.of(student));
        when(bookIssueRepository.findByUser_IdOrderByIssueDateDesc(1)).thenReturn(List.of(firstIssue, secondIssue));

        List<BookIssueResponse> issues = bookIssueService.getIssuesForCurrentUser();

        assertEquals(2, issues.size());
        assertEquals(10, issues.get(0).getIssueId());
        assertEquals(11, issues.get(1).getIssueId());
        assertEquals("Jane Doe", issues.get(0).getUserName());
    }
}
