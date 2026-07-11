package com.project.lms.service;

import org.springframework.stereotype.Service;

import com.project.lms.dto.DashboardResponse;
import com.project.lms.entity.ComplaintStatus;
import com.project.lms.entity.EnquiryStatus;
import com.project.lms.entity.IssueStatus;
import com.project.lms.entity.Role;
import com.project.lms.repository.BookIssueRepository;
import com.project.lms.repository.BookRepository;
import com.project.lms.repository.CategoryRepository;
import com.project.lms.repository.ComplaintRepository;
import com.project.lms.repository.EnquiryRepository;
import com.project.lms.repository.FeedbackRepository;
import com.project.lms.repository.NewsRepository;
import com.project.lms.repository.UserRepository;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BookIssueRepository bookIssueRepository;
    private final ComplaintRepository complaintRepository;
    private final FeedbackRepository feedbackRepository;
    private final NewsRepository newsRepository;
    private final EnquiryRepository enquiryRepository;

    public DashboardService(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            BookRepository bookRepository,
            BookIssueRepository bookIssueRepository,
            ComplaintRepository complaintRepository,
            FeedbackRepository feedbackRepository,
            NewsRepository newsRepository,
            EnquiryRepository enquiryRepository) {

        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
        this.bookIssueRepository = bookIssueRepository;
        this.complaintRepository = complaintRepository;
        this.feedbackRepository = feedbackRepository;
        this.newsRepository = newsRepository;
        this.enquiryRepository = enquiryRepository;
    }

    public DashboardResponse getDashboard() {

        return DashboardResponse.builder()

                // Users
                .totalUsers(userRepository.count())
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalLibrarians(userRepository.countByRole(Role.LIBRARIAN))
                .totalAdmins(userRepository.countByRole(Role.ADMIN))

                // Library
                .totalCategories(categoryRepository.count())
                .totalBooks(bookRepository.count())

                // Book Issues
                .totalIssuedBooks(bookIssueRepository.countByStatus(IssueStatus.ISSUED))
                .totalReturnedBooks(bookIssueRepository.countByStatus(IssueStatus.RETURNED))

                // Complaints
                .totalComplaints(complaintRepository.count())
                .pendingComplaints(
                        complaintRepository.countByStatus(ComplaintStatus.PENDING))

                // Feedback
                .totalFeedback(feedbackRepository.count())

                // News
                .totalNews(newsRepository.count())

                // Enquiries
                .totalEnquiries(enquiryRepository.count())
                .openEnquiries(
                        enquiryRepository.countByStatus(EnquiryStatus.OPEN))

                .build();
    }
}