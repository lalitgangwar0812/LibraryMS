package com.project.lms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.lms.dto.NewsRequest;
import com.project.lms.dto.NewsResponse;
import com.project.lms.entity.News;
import com.project.lms.entity.Role;
import com.project.lms.entity.User;
import com.project.lms.exception.BadRequestException;
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

    public NewsResponse createNews(NewsRequest request) {
        User author = resolveCurrentUser();

        if (author.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only admin users can create news");
        }

        News news = News.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .postedBy(author)
                .published(request.getPublished() == null ? true : request.getPublished())
                .build();

        News savedNews = newsRepository.save(news);
        return mapToResponse(savedNews);
    }

    public NewsResponse updateNews(Integer newsId, NewsRequest request) {
        User author = resolveCurrentUser();

        if (author.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only admin users can edit news");
        }

        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new ResourceNotFoundException("News not found"));

        news.setTitle(request.getTitle().trim());
        news.setDescription(request.getDescription().trim());
        news.setPublished(request.getPublished() == null ? news.isPublished() : request.getPublished());
        return mapToResponse(newsRepository.save(news));
    }

    public void deleteNews(Integer newsId) {
        User actor = resolveCurrentUser();

        if (actor.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only admin users can delete news");
        }

        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new ResourceNotFoundException("News not found"));
        newsRepository.delete(news);
    }

    public List<NewsResponse> getAllNews() {
        return newsRepository.findByPublishedTrueOrderByCreatedAtDesc(PageRequest.of(0, 20)).getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NewsResponse getNewsById(Integer newsId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new ResourceNotFoundException("News not found"));

        if (!news.isPublished()) {
            User currentUser = resolveCurrentUserIfAuthenticated();
            if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
                throw new BadRequestException("News is not published");
            }
        }

        return mapToResponse(news);
    }

    public List<NewsResponse> getNewsByUser(Integer userId) {
        return newsRepository.findByPostedBy_Id(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> searchByTitle(String title) {
        return newsRepository.findByTitleContainingIgnoreCaseAndPublishedTrue(title, PageRequest.of(0, 50)).getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> getAdminNews(String search, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        Page<News> result;

        if (search == null || search.isBlank()) {
            result = newsRepository.findAllByOrderByCreatedAtDesc(pageable);
        } else {
            result = newsRepository.findByTitleContainingIgnoreCase(search.trim(), pageable);
        }

        return result.getContent().stream().map(this::mapToResponse).collect(Collectors.toList());
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

    private User resolveCurrentUserIfAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String email = authentication.getName();
        return userRepository.findByEmailIgnoreCase(email).orElse(null);
    }

    private NewsResponse mapToResponse(News news) {
        return NewsResponse.builder()
                .newsId(news.getNewsId())
                .title(news.getTitle())
                .description(news.getDescription())
                .postedBy(news.getPostedBy().getId())
                .postedByName(news.getPostedBy().getFullName())
                .createdAt(news.getCreatedAt())
                .published(news.isPublished())
                .build();
    }
}