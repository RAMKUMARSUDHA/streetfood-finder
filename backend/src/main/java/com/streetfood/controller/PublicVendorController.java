package com.streetfood.controller;
import com.streetfood.dto.*;
import com.streetfood.model.MenuItem;
import com.streetfood.repository.*;
import com.streetfood.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class PublicVendorController {
    private final VendorRepository vendorRepo;
    private final MenuItemRepository menuRepo;
    private final ReviewService reviewService;
    private final VendorService vendorService;
    @GetMapping("/vendors") public ResponseEntity<List<VendorDTO>> all(){
        return ResponseEntity.ok(vendorRepo.findByStatus("APPROVED").stream().map(vendorService::toDTO).collect(Collectors.toList()));
    }
    @GetMapping("/vendors/{id}") public ResponseEntity<VendorDTO> one(@PathVariable Long id){
        return vendorRepo.findById(id).map(v->ResponseEntity.ok(vendorService.toDTO(v))).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/vendors/{id}/menu") public ResponseEntity<List<MenuItem>> menu(@PathVariable Long id){
        return ResponseEntity.ok(menuRepo.findByVendorId(id));
    }
    @GetMapping("/vendors/{id}/reviews") public ResponseEntity<List<ReviewDTO>> reviews(@PathVariable Long id){
        return ResponseEntity.ok(reviewService.getApprovedByVendor(id));
    }
}
