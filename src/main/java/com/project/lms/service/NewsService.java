package com.project.lms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.lms.dto.NewsRequest;
import com.project.lms.dto.NewsResponse;
import com.project.lms.entity.News;
import com.project.lms.entity.User;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.NewsRepository;
import com.project.lms.repository.UserRepository;

@Service
public class NewsService {

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    public NewsService(NewsRepository newsRepository,
                       UserRepository userRepository) {

        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
    }

    // Create News
    public NewsResponse createNews(NewsRequest request) {

        User user = userRepository.findById(request.getPostedBy())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        News news = News.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .postedBy(user)
                .build();

        News savedNews = newsRepository.save(news);

        return mapToResponse(savedNews);
    }

    // Get All News
    public List<NewsResponse> getAllNews() {

        return newsRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get News By ID
    public NewsResponse getNewsById(Integer newsId) {

        News news = newsRepository.findById(newsId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("News not found"));

        return mapToResponse(news);
    }

    // Get News By User
    public List<NewsResponse> getNewsByUser(Integer userId) {

        return newsRepository.findByPostedBy_Id(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Search News By Title
    public List<NewsResponse> searchByTitle(String title) {

        return newsRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Entity -> DTO
    private NewsResponse mapToResponse(News news) {

        return NewsResponse.builder()
                .newsId(news.getNewsId())
                .title(news.getTitle())
                .description(news.getDescription())
                .postedBy(news.getPostedBy().getId())
                .postedByName(news.getPostedBy().getFullName())
                .createdAt(news.getCreatedAt())
                .build();
    }
}