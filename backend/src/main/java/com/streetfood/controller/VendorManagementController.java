package com.streetfood.controller;
import com.streetfood.dto.*;
import com.streetfood.model.*;
import com.streetfood.repository.*;
import com.streetfood.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
@RestController @RequestMapping("/api/vendor") @RequiredArgsConstructor
public class VendorManagementController {
    private final VendorRepository vendorRepo;
    private final MenuItemRepository menuRepo;
    private final ReviewRepository reviewRepo;
    private final VendorService vendorService;
    private final ReviewService reviewService;
    private Vendor getV(Authentication auth){return vendorService.getVendorEntity(auth.getName());}
    @GetMapping("/my-shop") public ResponseEntity<VendorDTO> myShop(Authentication auth){return ResponseEntity.ok(vendorService.toDTO(getV(auth)));}
    @PutMapping("/toggle-live") public ResponseEntity<VendorDTO> toggleLive(Authentication auth){
        Vendor v=getV(auth);
        if(!"APPROVED".equals(v.getStatus())) throw new RuntimeException("Admin approval required");
        v.setIsLive(!Boolean.TRUE.equals(v.getIsLive()));
        return ResponseEntity.ok(vendorService.toDTO(vendorRepo.save(v)));
    }
    @PutMapping("/shop") public ResponseEntity<VendorDTO> updateShop(@RequestBody VendorDTO dto,Authentication auth){
        Vendor v=getV(auth);
        if(dto.getShopName()!=null)v.setShopName(dto.getShopName());
        if(dto.getCity()!=null)v.setCity(dto.getCity());
        if(dto.getAddress()!=null)v.setAddress(dto.getAddress());
        if(dto.getCategory()!=null)v.setCategory(dto.getCategory());
        if(dto.getDescription()!=null)v.setDescription(dto.getDescription());
        if(dto.getPhotoUrl()!=null)v.setPhotoUrl(dto.getPhotoUrl());
        if(dto.getOpeningTime()!=null)v.setOpeningTime(dto.getOpeningTime());
        if(dto.getClosingTime()!=null)v.setClosingTime(dto.getClosingTime());
        if(dto.getPriceRange()!=null)v.setPriceRange(dto.getPriceRange());
        if(dto.getLat()!=null)v.setLat(dto.getLat());
        if(dto.getLng()!=null)v.setLng(dto.getLng());
        return ResponseEntity.ok(vendorService.toDTO(vendorRepo.save(v)));
    }
    @GetMapping("/menu") public ResponseEntity<List<MenuItem>> getMenu(Authentication auth){return ResponseEntity.ok(menuRepo.findByVendorId(getV(auth).getId()));}
    @PostMapping("/menu") public ResponseEntity<MenuItem> addItem(@RequestBody MenuItem item,Authentication auth){
        item.setVendor(getV(auth)); if(item.getIsAvailable()==null)item.setIsAvailable(true);
        return ResponseEntity.ok(menuRepo.save(item));
    }
    @PutMapping("/menu/{id}") public ResponseEntity<MenuItem> updateItem(@PathVariable Long id,@RequestBody MenuItem u){
        MenuItem item=menuRepo.findById(id).orElseThrow(()->new RuntimeException("Not found"));
        if(u.getName()!=null)item.setName(u.getName()); if(u.getDescription()!=null)item.setDescription(u.getDescription());
        if(u.getCategory()!=null)item.setCategory(u.getCategory()); if(u.getPrice()!=null)item.setPrice(u.getPrice());
        if(u.getIsAvailable()!=null)item.setIsAvailable(u.getIsAvailable());
        return ResponseEntity.ok(menuRepo.save(item));
    }
    @DeleteMapping("/menu/{id}") public ResponseEntity<Void> deleteItem(@PathVariable Long id){menuRepo.deleteById(id);return ResponseEntity.ok().build();}
    @GetMapping("/reviews") public ResponseEntity<List<ReviewDTO>> reviews(Authentication auth){
        return ResponseEntity.ok(reviewRepo.findByVendorId(getV(auth).getId()).stream().map(reviewService::toDTO).collect(Collectors.toList()));
    }
}
