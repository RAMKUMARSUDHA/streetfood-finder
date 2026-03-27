package com.streetfood.repository;
import com.streetfood.model.AdminCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AdminCredentialRepository extends JpaRepository<AdminCredential,Long> { Optional<AdminCredential> findByEmail(String email); }
