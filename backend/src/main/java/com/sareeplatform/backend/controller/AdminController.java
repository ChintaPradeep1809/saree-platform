package com.sareeplatform.backend.controller;

import com.sareeplatform.backend.repository.OrderRepository;
import com.sareeplatform.backend.repository.ProductRepository;
import com.sareeplatform.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalProducts = productRepository.countByActiveTrue();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();

        return ResponseEntity.ok(Map.of(
                "totalProducts", totalProducts,
                "totalOrders", totalOrders,
                "totalUsers", totalUsers,
                "totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO
        ));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(uploadDir, "images");
        Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        String url = baseUrl + "/uploads/images/" + filename;
        return ResponseEntity.ok(Map.of("url", url));
    }
}
