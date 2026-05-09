package com.sareeplatform.backend.service;

import com.sareeplatform.backend.dto.request.CategoryRequest;
import com.sareeplatform.backend.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllActive();
    CategoryResponse getById(Long id);
    CategoryResponse create(CategoryRequest request);
    CategoryResponse update(Long id, CategoryRequest request);
    void delete(Long id);
}
