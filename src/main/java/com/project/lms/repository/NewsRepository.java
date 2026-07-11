package com.project.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.News;

public interface NewsRepository extends JpaRepository<News, Integer> {

    // News posted by a specific user
    List<News> findByPostedBy_Id(Integer userId);

    // Latest news first
    List<News> findAllByOrderByCreatedAtDesc();

    // Search by title
    List<News> findByTitleContainingIgnoreCase(String title);
}