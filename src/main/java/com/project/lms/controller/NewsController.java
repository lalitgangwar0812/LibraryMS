package com.project.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.lms.dto.NewsRequest;
import com.project.lms.dto.NewsResponse;
import com.project.lms.service.NewsService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/news")
@Validated
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // Create News
    @PostMapping
    public ResponseEntity<NewsResponse> createNews(
            @Valid @RequestBody NewsRequest request) {

        return new ResponseEntity<>(
                newsService.createNews(request),
                HttpStatus.CREATED);
    }

    // Get All News
    @GetMapping
    public ResponseEntity<List<NewsResponse>> getAllNews() {

        return ResponseEntity.ok(
                newsService.getAllNews());
    }

    // Get News By ID
    @GetMapping("/{newsId}")
    public ResponseEntity<NewsResponse> getNewsById(
            @PathVariable Integer newsId) {

        return ResponseEntity.ok(
                newsService.getNewsById(newsId));
    }

    // Get News By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NewsResponse>> getNewsByUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                newsService.getNewsByUser(userId));
    }

    // Search News By Title
    @GetMapping("/search")
    public ResponseEntity<List<NewsResponse>> searchNews(
            @RequestParam String title) {

        return ResponseEntity.ok(
                newsService.searchByTitle(title));
    }
}