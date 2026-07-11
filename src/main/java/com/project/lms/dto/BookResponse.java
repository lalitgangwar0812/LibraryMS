package com.project.lms.dto;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {

    private Integer bookId;

    private String title;

    private String author;

    private String isbn;

    private Integer categoryId;

    private String categoryName;

    private Integer quantity;

    private Integer availableQuantity;

    private String shelfNo;

    private LocalDateTime createdAt;
}