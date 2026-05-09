package com.sareeplatform.backend.service.impl;

import com.sareeplatform.backend.dto.request.CategoryRequest;
import com.sareeplatform.backend.dto.response.CategoryResponse;
import com.sareeplatform.backend.entity.Category;
import com.sareeplatform.backend.exception.BadRequestException;
import com.sareeplatform.backend.exception.ResourceNotFoundException;
import com.sareeplatform.backend.repository.CategoryRepository;
import com.sareeplatform.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllActive() {
        return categoryRepository.findByActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category already exists: " + request.getName());
        }
        Category category = Category.builder()
                .name(request.getName())
                .slug(toSlug(request.getName()))
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findById(id);
        category.setName(request.getName());
        category.setSlug(toSlug(request.getName()));
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void delete(Long id) {
        Category category = findById(id);
        category.setActive(false);
        categoryRepository.save(category);
    }

    private Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    private String toSlug(String name) {
        return name.toLowerCase().trim().replaceAll("[^a-z0-9]+", "-");
    }

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .imageUrl(c.getImageUrl())
                .active(c.isActive())
                .build();
    }
}
