package com.project.lms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.lms.dto.StudentResponse;
import com.project.lms.service.AdminStudentService;

@RestController
@RequestMapping("/api/admin/students")
public class AdminStudentController {

    private final AdminStudentService adminStudentService;

    public AdminStudentController(AdminStudentService adminStudentService) {
        this.adminStudentService = adminStudentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getStudents(
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(adminStudentService.getStudents(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudent(
            @PathVariable Integer id) {

        return ResponseEntity.ok(adminStudentService.getStudent(id));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<StudentResponse> toggleStudentStatus(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                adminStudentService.toggleStudentStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Integer id) {

        adminStudentService.deleteStudent(id);
        return ResponseEntity.ok("Student account deleted successfully");
    }
}