package com.project.lms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.lms.dto.NewsResponse;
import com.project.lms.service.NewsService;

@RestController
@RequestMapping("/api/news")
@Validated
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsResponse>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/{newsId}")
    public ResponseEntity<NewsResponse> getNewsById(@PathVariable Integer newsId) {
        return ResponseEntity.ok(newsService.getNewsById(newsId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NewsResponse>> getNewsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(newsService.getNewsByUser(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<NewsResponse>> searchNews(@RequestParam String title) {
        return ResponseEntity.ok(newsService.searchByTitle(title));
    }
}