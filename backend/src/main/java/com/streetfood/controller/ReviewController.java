package com.streetfood.controller;
import com.streetfood.dto.ReviewDTO;
import com.streetfood.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/reviews") @RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    @PostMapping public ResponseEntity<ReviewDTO> add(@RequestBody ReviewDTO dto,Authentication auth){
        return ResponseEntity.ok(reviewService.add(auth.getName(),dto.getVendorId(),dto.getRating(),dto.getComment()));
    }
}
