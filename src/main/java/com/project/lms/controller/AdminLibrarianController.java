package com.project.lms.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.lms.dto.LibrarianRequest;
import com.project.lms.dto.LibrarianResponse;
import com.project.lms.dto.LibrarianStatusRequest;
import com.project.lms.service.AdminLibrarianService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/librarians")
public class AdminLibrarianController {

    private final AdminLibrarianService librarianService;

    public AdminLibrarianController(AdminLibrarianService librarianService) {
        this.librarianService = librarianService;
    }

    @GetMapping
    public ResponseEntity<Page<LibrarianResponse>> getLibrarians(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(Math.max(size, 1), 100),
                Sort.by(Sort.Direction.ASC, "fullName"));
        return ResponseEntity.ok(librarianService.getLibrarians(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LibrarianResponse> getLibrarian(@PathVariable Integer id) {
        return ResponseEntity.ok(librarianService.getLibrarian(id));
    }

    @PostMapping
    public ResponseEntity<LibrarianResponse> createLibrarian(
            @Valid @RequestBody LibrarianRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(librarianService.createLibrarian(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibrarianResponse> updateLibrarian(
            @PathVariable Integer id,
            @Valid @RequestBody LibrarianRequest request) {
        return ResponseEntity.ok(librarianService.updateLibrarian(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LibrarianResponse> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody LibrarianStatusRequest request) {
        return ResponseEntity.ok(librarianService.updateStatus(id, request.getEnabled()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLibrarian(@PathVariable Integer id) {
        librarianService.deleteLibrarian(id);
        return ResponseEntity.noContent().build();
    }
}
