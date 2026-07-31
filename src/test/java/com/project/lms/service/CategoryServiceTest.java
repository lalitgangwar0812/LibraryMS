package com.project.lms.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.project.lms.entity.Book;
import com.project.lms.entity.Category;
import com.project.lms.exception.BadRequestException;
import com.project.lms.repository.BookRepository;
import com.project.lms.repository.CategoryRepository;

class CategoryServiceTest {

    @Test
    void deleteCategory_shouldThrowWhenBooksExist() {
        CategoryRepository categoryRepository = mock(CategoryRepository.class);
        BookRepository bookRepository = mock(BookRepository.class);
        CategoryService categoryService = new CategoryService(categoryRepository, bookRepository);

        Category category = Category.builder()
                .categoryId(1)
                .categoryName("Fiction")
                .build();

        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(bookRepository.findByCategory_CategoryId(1)).thenReturn(List.of(mock(Book.class)));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> categoryService.deleteCategory(1)
        );

        assertEquals("Cannot delete category because books exist in this category", exception.getMessage());
        verify(categoryRepository, never()).delete(category);
    }
}
