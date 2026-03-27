package com.streetfood.service;
import com.streetfood.dto.AuthDTOs;
import com.streetfood.model.*;
import com.streetfood.repository.*;
import com.streetfood.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final VendorRepository vendorRepo;
    private final AdminCredentialRepository adminRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest req){
        String email=req.getEmail().trim();
        var adminOpt=adminRepo.findByEmail(email);
        if(adminOpt.isPresent()){
            if(!req.getPassword().equals(adminOpt.get().getPassword())) throw new RuntimeException("Invalid email or password");
            return new AuthDTOs.AuthResponse(jwtUtil.generateToken(email,"ADMIN"),0L,adminOpt.get().getName(),email,"ADMIN",null);
        }
        User user=userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("Invalid email or password"));
        if(!encoder.matches(req.getPassword(),user.getPassword())) throw new RuntimeException("Invalid email or password");
        return new AuthDTOs.AuthResponse(jwtUtil.generateToken(user.getEmail(),user.getRole()),user.getId(),user.getName(),user.getEmail(),user.getRole(),user.getPhone());
    }
    public AuthDTOs.AuthResponse registerCustomer(AuthDTOs.RegisterRequest req){
        if(userRepo.findByEmail(req.getEmail().trim()).isPresent()) throw new RuntimeException("Email already registered");
        User u=new User(); u.setName(req.getName().trim()); u.setEmail(req.getEmail().trim());
        u.setPhone(req.getPhone()); u.setPassword(encoder.encode(req.getPassword())); u.setRole("CUSTOMER");
        User saved=userRepo.save(u);
        return new AuthDTOs.AuthResponse(jwtUtil.generateToken(saved.getEmail(),"CUSTOMER"),saved.getId(),saved.getName(),saved.getEmail(),"CUSTOMER",saved.getPhone());
    }
    public AuthDTOs.AuthResponse registerVendor(AuthDTOs.RegisterRequest req){
        if(userRepo.findByEmail(req.getEmail().trim()).isPresent()) throw new RuntimeException("Email already registered");
        User u=new User(); u.setName(req.getName().trim()); u.setEmail(req.getEmail().trim());
        u.setPhone(req.getPhone()); u.setPassword(encoder.encode(req.getPassword())); u.setRole("VENDOR");
        User saved=userRepo.save(u);
        Vendor v=new Vendor(); v.setUser(saved); v.setOwnerName(saved.getName());
        v.setOwnerEmail(saved.getEmail()); v.setOwnerPhone(saved.getPhone());
        v.setShopName(req.getShopName()!=null&&!req.getShopName().trim().isEmpty()?req.getShopName().trim():req.getName()+"'s Shop");
        v.setStatus("PENDING"); v.setIsLive(false);
        vendorRepo.save(v);
        return new AuthDTOs.AuthResponse(jwtUtil.generateToken(saved.getEmail(),"VENDOR"),saved.getId(),saved.getName(),saved.getEmail(),"VENDOR",saved.getPhone());
    }
}
