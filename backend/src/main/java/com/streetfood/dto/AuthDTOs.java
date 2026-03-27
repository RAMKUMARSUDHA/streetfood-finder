package com.streetfood.dto;
public class AuthDTOs {
    public static class LoginRequest {
        private String email,password;
        public String getEmail(){return email;} public void setEmail(String s){this.email=s;}
        public String getPassword(){return password;} public void setPassword(String s){this.password=s;}
    }
    public static class RegisterRequest {
        private String name,email,phone,password,shopName;
        public String getName(){return name;} public void setName(String s){this.name=s;}
        public String getEmail(){return email;} public void setEmail(String s){this.email=s;}
        public String getPhone(){return phone;} public void setPhone(String s){this.phone=s;}
        public String getPassword(){return password;} public void setPassword(String s){this.password=s;}
        public String getShopName(){return shopName;} public void setShopName(String s){this.shopName=s;}
    }
    public static class AuthResponse {
        private String token,name,email,role,phone; private Long id;
        public AuthResponse(){}
        public AuthResponse(String token,Long id,String name,String email,String role,String phone){
            this.token=token;this.id=id;this.name=name;this.email=email;this.role=role;this.phone=phone;}
        public String getToken(){return token;} public void setToken(String s){this.token=s;}
        public Long getId(){return id;} public void setId(Long i){this.id=i;}
        public String getName(){return name;} public void setName(String s){this.name=s;}
        public String getEmail(){return email;} public void setEmail(String s){this.email=s;}
        public String getRole(){return role;} public void setRole(String s){this.role=s;}
        public String getPhone(){return phone;} public void setPhone(String s){this.phone=s;}
    }
}
