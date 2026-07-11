package com.project.lms.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.lms.dto.BookIssueRequest;
import com.project.lms.dto.BookIssueResponse;
import com.project.lms.entity.Book;
import com.project.lms.entity.BookIssue;
import com.project.lms.entity.IssueStatus;
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
    public BookIssueResponse issueBook(BookIssueRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

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
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);

        bookRepository.save(book);

        BookIssue updatedIssue = bookIssueRepository.save(issue);

        return mapToResponse(updatedIssue);
    }

    // Get All Issues
    public List<BookIssueResponse> getAllIssues() {

        return bookIssueRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Issue By ID
    public BookIssueResponse getIssueById(Integer id) {

        BookIssue issue = bookIssueRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Issue record not found"));

        return mapToResponse(issue);
    }

    // Get Issues By User
    public List<BookIssueResponse> getIssuesByUser(Integer userId) {

        return bookIssueRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Issues By Book
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
                .build();
    }
}