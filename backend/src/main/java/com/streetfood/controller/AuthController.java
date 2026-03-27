package com.streetfood.controller;
import com.streetfood.dto.AuthDTOs;
import com.streetfood.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/login") public ResponseEntity<?> login(@RequestBody AuthDTOs.LoginRequest req){
        try{return ResponseEntity.ok(authService.login(req));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}
    }
    @PostMapping("/register-customer") public ResponseEntity<?> regCustomer(@RequestBody AuthDTOs.RegisterRequest req){
        try{return ResponseEntity.ok(authService.registerCustomer(req));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}
    }
    @PostMapping("/register-vendor") public ResponseEntity<?> regVendor(@RequestBody AuthDTOs.RegisterRequest req){
        try{return ResponseEntity.ok(authService.registerVendor(req));}catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}
    }
}
