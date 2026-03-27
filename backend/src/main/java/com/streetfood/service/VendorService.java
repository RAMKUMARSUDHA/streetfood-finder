package com.streetfood.service;
import com.streetfood.dto.VendorDTO;
import com.streetfood.model.Vendor;
import com.streetfood.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class VendorService {
    private final VendorRepository vendorRepo;
    public List<VendorDTO> getAllApproved(){return vendorRepo.findByStatus("APPROVED").stream().map(this::toDTO).collect(Collectors.toList());}
    public Vendor getVendorEntity(String email){
        return vendorRepo.findByOwnerEmail(email).orElseGet(()->vendorRepo.findAll().stream()
            .filter(v->v.getUser()!=null&&email.equals(v.getUser().getEmail())).findFirst()
            .orElseThrow(()->new RuntimeException("Vendor profile not found")));
    }
    public VendorDTO toDTO(Vendor v){
        VendorDTO d=new VendorDTO();
        d.setId(v.getId()); d.setShopName(v.getShopName()); d.setOwnerName(v.getOwnerName());
        d.setOwnerEmail(v.getOwnerEmail()); d.setOwnerPhone(v.getOwnerPhone());
        d.setCity(v.getCity()); d.setAddress(v.getAddress()); d.setCategory(v.getCategory());
        d.setDescription(v.getDescription()); d.setPhotoUrl(v.getPhotoUrl());
        d.setOpeningTime(v.getOpeningTime()); d.setClosingTime(v.getClosingTime());
        d.setPriceRange(v.getPriceRange()); d.setStatus(v.getStatus()); d.setIsLive(v.getIsLive());
        d.setLat(v.getLat()); d.setLng(v.getLng());
        d.setAvgRating(v.getAvgRating()!=null?v.getAvgRating():0.0);
        d.setTotalReviews(v.getTotalReviews()!=null?v.getTotalReviews():0);
        return d;
    }
}
