package com.sareeplatform.backend.service.impl;

import com.sareeplatform.backend.dto.request.ProductRequest;
import com.sareeplatform.backend.dto.response.ProductResponse;
import com.sareeplatform.backend.entity.Category;
import com.sareeplatform.backend.entity.Product;
import com.sareeplatform.backend.entity.ProductImage;
import com.sareeplatform.backend.exception.BadRequestException;
import com.sareeplatform.backend.exception.ResourceNotFoundException;
import com.sareeplatform.backend.repository.CategoryRepository;
import com.sareeplatform.backend.repository.ProductRepository;
import com.sareeplatform.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<ProductResponse> getAll(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable).map(this::toResponse);
    }

    @Override
    public Page<ProductResponse> getByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::toResponse);
    }

    @Override
    public List<ProductResponse> getLatest() {
        return productRepository.findTop8ByActiveTrueOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public ProductResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Override
    public ProductResponse create(ProductRequest request) {
        if (request.getSku() != null && productRepository.existsBySku(request.getSku())) {
            throw new BadRequestException("SKU already exists: " + request.getSku());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .stockQuantity(request.getStockQuantity())
                .sku(request.getSku())
                .fabric(request.getFabric())
                .color(request.getColor())
                .occasion(request.getOccasion())
                .category(category)
                .build();

        Product saved = productRepository.save(product);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(ProductImage.builder()
                        .product(saved)
                        .imageUrl(request.getImageUrls().get(i))
                        .isPrimary(i == 0)
                        .displayOrder(i)
                        .build());
            }
            saved.setImages(images);
            productRepository.save(saved);
        }

        return toResponse(saved);
    }

    @Override
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setFabric(request.getFabric());
        product.setColor(request.getColor());
        product.setOccasion(request.getOccasion());
        product.setCategory(category);

        return toResponse(productRepository.save(product));
    }

    @Override
    public void delete(Long id) {
        Product product = findById(id);
        product.setActive(false);
        productRepository.save(product);
    }

    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private ProductResponse toResponse(Product p) {
        List<String> imageUrls = p.getImages() != null
                ? p.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList())
                : List.of();

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .originalPrice(p.getOriginalPrice())
                .stockQuantity(p.getStockQuantity())
                .sku(p.getSku())
                .fabric(p.getFabric())
                .color(p.getColor())
                .occasion(p.getOccasion())
                .active(p.isActive())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .imageUrls(imageUrls)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
