package com.project.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.lms.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    // All feedback of a user
    List<Feedback> findByUser_Id(Integer userId);

    // Feedback by rating
    List<Feedback> findByRating(Integer rating);

    // Search by rating and student name
    @Query("""
            SELECT f
            FROM Feedback f
            WHERE (:rating IS NULL OR f.rating = :rating)
              AND (
                    :search = ''
                    OR LOWER(f.user.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            ORDER BY f.createdAt DESC
            """)
    List<Feedback> searchByRatingAndSearch(
            @Param("rating") Integer rating,
            @Param("search") String search);

    // Feedback ordered by latest
    List<Feedback> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(AVG(f.rating), 0) FROM Feedback f")
    double averageRating();

}