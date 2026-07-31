package com.project.lms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.lms.dto.BookRequest;
import com.project.lms.dto.BookResponse;
import com.project.lms.entity.Book;
import com.project.lms.entity.Category;
import com.project.lms.exception.DuplicateResourceException;
import com.project.lms.exception.BadRequestException;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.BookIssueRepository;
import com.project.lms.repository.BookRepository;
import com.project.lms.repository.CategoryRepository;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookIssueRepository bookIssueRepository;

    public BookService(BookRepository bookRepository,
                       CategoryRepository categoryRepository,
                       BookIssueRepository bookIssueRepository) {

        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.bookIssueRepository = bookIssueRepository;
    }

    // Create Book
    public BookResponse createBook(BookRequest request) {

        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new DuplicateResourceException("Book with this ISBN already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .category(category)
                .quantity(request.getQuantity())
                .availableQuantity(request.getQuantity())
                .shelfNo(request.getShelfNo())
                .build();

        Book savedBook = bookRepository.save(book);

        return mapToResponse(savedBook);
    }

    // Get All Books
    public List<BookResponse> getAllBooks() {

        return bookRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Book By ID
    public BookResponse getBookById(Integer id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found"));

        return mapToResponse(book);
    }

    // Update Book
    @Transactional
    public BookResponse updateBook(Integer id, BookRequest request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        if (!book.getIsbn().equals(request.getIsbn())
                && bookRepository.existsByIsbn(request.getIsbn())) {

            throw new DuplicateResourceException("Book with this ISBN already exists");
        }

        int borrowedBooks =
                book.getQuantity() - book.getAvailableQuantity();

        if (request.getQuantity() < borrowedBooks) {
            throw new BadRequestException("Quantity cannot be lower than the number of issued copies");
        }

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setCategory(category);
        book.setQuantity(request.getQuantity());
        book.setAvailableQuantity(request.getQuantity() - borrowedBooks);
        book.setShelfNo(request.getShelfNo());

        Book updatedBook = bookRepository.save(book);

        return mapToResponse(updatedBook);
    }

    // Delete Book
    @Transactional
    public String deleteBook(Integer id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found"));

        if (bookIssueRepository.existsByBook_BookId(id)) {
            throw new BadRequestException("Cannot delete book because issue history exists");
        }

        bookRepository.delete(book);

        return "Book deleted successfully";
    }

    // Search By Title
    public List<BookResponse> searchByTitle(String title) {

        return bookRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Search By Author
    public List<BookResponse> searchByAuthor(String author) {

        return bookRepository.findByAuthorContainingIgnoreCase(author)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Search By Category
    public List<BookResponse> getBooksByCategory(Integer categoryId) {

        return bookRepository.findByCategory_CategoryId(categoryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Entity -> DTO
    private BookResponse mapToResponse(Book book) {

        return BookResponse.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .categoryId(book.getCategory().getCategoryId())
                .categoryName(book.getCategory().getCategoryName())
                .quantity(book.getQuantity())
                .availableQuantity(book.getAvailableQuantity())
                .shelfNo(book.getShelfNo())
                .createdAt(book.getCreatedAt())
                .build();
    }
}
