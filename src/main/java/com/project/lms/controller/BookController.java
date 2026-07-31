package com.project.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.lms.dto.BookRequest;
import com.project.lms.dto.BookResponse;
import com.project.lms.dto.CategoryResponse;
import com.project.lms.service.CategoryService;
import com.project.lms.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
@Validated
public class BookController {

    private final BookService bookService;
    private final CategoryService categoryService;

    public BookController(BookService bookService, CategoryService categoryService) {
        this.bookService = bookService;
        this.categoryService = categoryService;
    }

    // Create Book
    @PostMapping
    public ResponseEntity<BookResponse> createBook(
            @Valid @RequestBody BookRequest request) {

        return new ResponseEntity<>(
                bookService.createBook(request),
                HttpStatus.CREATED);
    }

    // Get All Books
    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {

        return ResponseEntity.ok(bookService.getAllBooks());
    }

    // Categories are exposed here only as catalog metadata for book creation and editing.
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getBookCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // Get Book By ID
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(bookService.getBookById(id));
    }

    // Update Book
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable Integer id,
            @Valid @RequestBody BookRequest request) {

        return ResponseEntity.ok(
                bookService.updateBook(id, request));
    }

    // Delete Book
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                bookService.deleteBook(id));
    }

    // Search Books By Title
    @GetMapping("/search/title")
    public ResponseEntity<List<BookResponse>> searchByTitle(
            @RequestParam String title) {

        return ResponseEntity.ok(
                bookService.searchByTitle(title));
    }

    // Search Books By Author
    @GetMapping("/search/author")
    public ResponseEntity<List<BookResponse>> searchByAuthor(
            @RequestParam String author) {

        return ResponseEntity.ok(
                bookService.searchByAuthor(author));
    }

    // Get Books By Category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BookResponse>> getBooksByCategory(
            @PathVariable Integer categoryId) {

        return ResponseEntity.ok(
                bookService.getBooksByCategory(categoryId));
    }
}
