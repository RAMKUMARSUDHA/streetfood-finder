package com.streetfood.repository;
import com.streetfood.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ReviewRepository extends JpaRepository<Review,Long> {
    List<Review> findByVendorId(Long vendorId);
    List<Review> findByCustomerId(Long customerId);
}
