package com.streetfood.controller;
import com.streetfood.dto.*;
import com.streetfood.model.*;
import com.streetfood.repository.*;
import com.streetfood.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepo;
    private final VendorRepository vendorRepo;
    private final ReviewRepository reviewRepo;
    private final VendorService vendorService;
    private final ReviewService reviewService;
    @GetMapping("/stats") public ResponseEntity<Map<String,Object>> stats(){
        long customers=userRepo.findAll().stream().filter(u->"CUSTOMER".equals(u.getRole())).count();
        long vendors=userRepo.findAll().stream().filter(u->"VENDOR".equals(u.getRole())).count();
        long pending=vendorRepo.findByStatus("PENDING").size(),approved=vendorRepo.findByStatus("APPROVED").size();
        long reviews=reviewRepo.count(),live=vendorRepo.findByIsLiveTrue().size();
        return ResponseEntity.ok(Map.of("customers",customers,"vendors",vendors,"pending",pending,"approved",approved,"reviews",reviews,"live",live,"total",customers+vendors));
    }
    @GetMapping("/users") public ResponseEntity<List<User>> users(){return ResponseEntity.ok(userRepo.findAll());}
    @DeleteMapping("/users/{id}") public ResponseEntity<Void> delUser(@PathVariable Long id){userRepo.deleteById(id);return ResponseEntity.ok().build();}
    @GetMapping("/vendors") public ResponseEntity<List<VendorDTO>> vendors(){
        return ResponseEntity.ok(vendorRepo.findAll().stream().map(vendorService::toDTO).collect(Collectors.toList()));
    }
    @PutMapping("/vendors/{id}/approve") public ResponseEntity<VendorDTO> approve(@PathVariable Long id){
        Vendor v=vendorRepo.findById(id).orElseThrow(); v.setStatus("APPROVED"); return ResponseEntity.ok(vendorService.toDTO(vendorRepo.save(v)));
    }
    @PutMapping("/vendors/{id}/reject") public ResponseEntity<VendorDTO> reject(@PathVariable Long id){
        Vendor v=vendorRepo.findById(id).orElseThrow(); v.setStatus("REJECTED"); return ResponseEntity.ok(vendorService.toDTO(vendorRepo.save(v)));
    }
    @DeleteMapping("/vendors/{id}") public ResponseEntity<Void> delVendor(@PathVariable Long id){vendorRepo.deleteById(id);return ResponseEntity.ok().build();}
    @GetMapping("/reviews") public ResponseEntity<List<ReviewDTO>> allReviews(){
        return ResponseEntity.ok(reviewRepo.findAll().stream().map(reviewService::toDTO).collect(Collectors.toList()));
    }
    @GetMapping("/reviews/pending") public ResponseEntity<List<ReviewDTO>> pendingReviews(){
        return ResponseEntity.ok(reviewRepo.findAll().stream().filter(r->!Boolean.TRUE.equals(r.getApproved())).map(reviewService::toDTO).collect(Collectors.toList()));
    }
    @PutMapping("/reviews/{id}/approve") public ResponseEntity<ReviewDTO> approveReview(@PathVariable Long id){
        Review r=reviewRepo.findById(id).orElseThrow(); r.setApproved(true); Review saved=reviewRepo.save(r);
        reviewService.updateVendorRating(r.getVendor()); return ResponseEntity.ok(reviewService.toDTO(saved));
    }
    @DeleteMapping("/reviews/{id}") public ResponseEntity<Void> delReview(@PathVariable Long id){reviewRepo.deleteById(id);return ResponseEntity.ok().build();}
}
