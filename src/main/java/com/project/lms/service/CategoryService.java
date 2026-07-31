package com.project.lms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.lms.dto.CategoryRequest;
import com.project.lms.dto.CategoryResponse;
import com.project.lms.entity.Category;
import com.project.lms.exception.BadRequestException;
import com.project.lms.exception.DuplicateResourceException;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repository.BookRepository;
import com.project.lms.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    public CategoryService(CategoryRepository categoryRepository, BookRepository bookRepository) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
    }

    // Create Category
    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new DuplicateResourceException("Category already exists");
        }

        Category category = Category.builder()
                .categoryName(request.getCategoryName())
                .build();

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    // Get All Categories
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Category By ID
    public CategoryResponse getCategoryById(Integer id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id));

        return mapToResponse(category);
    }

    // Update Category
    public CategoryResponse updateCategory(Integer id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getCategoryName().equalsIgnoreCase(request.getCategoryName())
                && categoryRepository.existsByCategoryName(request.getCategoryName())) {

            throw new DuplicateResourceException("Category already exists");
        }

        category.setCategoryName(request.getCategoryName());

        Category updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    // Delete Category
    public String deleteCategory(Integer id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id));

        if (!bookRepository.findByCategory_CategoryId(id).isEmpty()) {
            throw new BadRequestException("Cannot delete category because books exist in this category");
        }

        categoryRepository.delete(category);

        return "Category deleted successfully";
    }

    // Entity -> DTO
    private CategoryResponse mapToResponse(Category category) {

        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .build();
    }
}