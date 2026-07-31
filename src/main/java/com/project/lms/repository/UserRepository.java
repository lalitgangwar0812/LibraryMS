package com.project.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.project.lms.entity.Role;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<User> findByRole(Role role);

    @Query("""
            SELECT u FROM User u
            WHERE u.role = :role
              AND (:search IS NULL
                   OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<User> searchByRole(
            @Param("role") Role role,
            @Param("search") String search,
            Pageable pageable);
    
    long countByRole(Role role);
}
