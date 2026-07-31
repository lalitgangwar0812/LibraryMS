package com.project.lms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.News;

public interface NewsRepository extends JpaRepository<News, Integer> {

    // News posted by a specific user
    List<News> findByPostedBy_Id(Integer userId);

    boolean existsByPostedBy_Id(Integer userId);

    // Latest news first
    List<News> findAllByOrderByCreatedAtDesc();

    Page<News> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<News> findByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<News> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<News> findByTitleContainingIgnoreCaseAndPublishedTrue(String title, Pageable pageable);
}
