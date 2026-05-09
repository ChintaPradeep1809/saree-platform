package com.sareeplatform.backend.service;

import com.sareeplatform.backend.dto.request.ProductRequest;
import com.sareeplatform.backend.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<ProductResponse> getAll(Pageable pageable);
    Page<ProductResponse> getByCategory(Long categoryId, Pageable pageable);
    List<ProductResponse> getLatest();
    ProductResponse getById(Long id);
    ProductResponse create(ProductRequest request);
    ProductResponse update(Long id, ProductRequest request);
    void delete(Long id);
}
