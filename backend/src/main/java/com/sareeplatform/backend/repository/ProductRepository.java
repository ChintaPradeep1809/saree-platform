package com.sareeplatform.backend.repository;

import com.sareeplatform.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByActiveTrue(Pageable pageable);
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);
    List<Product> findTop8ByActiveTrueOrderByCreatedAtDesc();
    boolean existsBySku(String sku);
}
