package com.streetfood.controller;
import com.streetfood.dto.VendorDTO;
import com.streetfood.model.*;
import com.streetfood.repository.*;
import com.streetfood.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController @RequestMapping("/api/favorites") @RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteRepository favRepo;
    private final UserRepository userRepo;
    private final VendorRepository vendorRepo;
    private final VendorService vendorService;

    private User getUser(Authentication auth){
        return userRepo.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<VendorDTO>> list(Authentication auth){
        return ResponseEntity.ok(
            favRepo.findByCustomerId(getUser(auth).getId())
                .stream()
                .map(f -> vendorService.toDTO(f.getVendor()))
                .collect(Collectors.toList())
        );
    }

    @PostMapping("/{vendorId}")
    public ResponseEntity<Map<String,Object>> add(@PathVariable Long vendorId, Authentication auth){
        User u = getUser(auth);
        if(favRepo.findByCustomerIdAndVendorId(u.getId(), vendorId).isPresent())
            return ResponseEntity.ok(Map.of("favorited", true));
        Vendor v = vendorRepo.findById(vendorId).orElseThrow();
        Favorite f = new Favorite();
        f.setCustomer(u);
        f.setVendor(v);
        favRepo.save(f);
        return ResponseEntity.ok(Map.of("favorited", true));
    }

    @Transactional  // ✅ இந்த annotation தான் fix!
    @DeleteMapping("/{vendorId}")
    public ResponseEntity<Map<String,Object>> remove(@PathVariable Long vendorId, Authentication auth){
        favRepo.deleteByCustomerIdAndVendorId(getUser(auth).getId(), vendorId);
        return ResponseEntity.ok(Map.of("favorited", false));
    }

    @GetMapping("/check/{vendorId}")
    public ResponseEntity<Map<String,Boolean>> check(@PathVariable Long vendorId, Authentication auth){
        boolean fav = favRepo.findByCustomerIdAndVendorId(getUser(auth).getId(), vendorId).isPresent();
        return ResponseEntity.ok(Map.of("favorited", fav));
    }
}