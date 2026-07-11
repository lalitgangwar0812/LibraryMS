package com.project.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    // All feedback of a user
    List<Feedback> findByUser_Id(Integer userId);

    // Feedback by rating
    List<Feedback> findByRating(Integer rating);

    // Feedback ordered by latest
    List<Feedback> findAllByOrderByCreatedAtDesc();

}