package com.project.lms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    // Users
    private long totalUsers;
    private long totalStudents;
    private long totalLibrarians;
    private long totalAdmins;

    // Library
    private long totalCategories;
    private long totalBooks;

    // Book Issue
    private long totalIssuedBooks;
    private long totalReturnedBooks;

    // Other Modules
    private long totalComplaints;
    private long pendingComplaints;

    private long totalFeedback;

    private long totalNews;

    private long totalEnquiries;
    private long openEnquiries;
}