package com.streetfood.repository;
import com.streetfood.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface VendorRepository extends JpaRepository<Vendor,Long> {
    List<Vendor> findByStatus(String status);
    Optional<Vendor> findByOwnerEmail(String email);
    Optional<Vendor> findByUserId(Long userId);
    List<Vendor> findByIsLiveTrue();
    List<Vendor> findByCityIgnoreCaseAndStatus(String city,String status);
    @Query("SELECT v FROM Vendor v WHERE v.status='APPROVED' AND v.lat IS NOT NULL AND v.lng IS NOT NULL AND (6371*acos(cos(radians(:lat))*cos(radians(v.lat))*cos(radians(v.lng)-radians(:lng))+sin(radians(:lat))*sin(radians(v.lat))))<:radius")
    List<Vendor> findNearbyVendors(@Param("lat") Double lat,@Param("lng") Double lng,@Param("radius") double radius);
}
