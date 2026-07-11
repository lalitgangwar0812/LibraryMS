package com.project.lms.repository;

import java.util.Optional;

import com.project.lms.entity.Role;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.lms.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    long countByRole(Role role);
}