package com.streetfood.repository;
import com.streetfood.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MenuItemRepository extends JpaRepository<MenuItem,Long> { List<MenuItem> findByVendorId(Long vendorId); }
