package com.streetfood.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String name;
    @Column(unique=true,nullable=false) private String email;
    @JsonIgnore private String password;
    private String phone;
    private String role="CUSTOMER";
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist public void pre(){ if(createdAt==null)createdAt=LocalDateTime.now(); if(role==null)role="CUSTOMER"; }
    public Long getId(){return id;} public void setId(Long i){this.id=i;}
    public String getName(){return name;} public void setName(String s){this.name=s;}
    public String getEmail(){return email;} public void setEmail(String s){this.email=s;}
    public String getPassword(){return password;} public void setPassword(String s){this.password=s;}
    public String getPhone(){return phone;} public void setPhone(String s){this.phone=s;}
    public String getRole(){return role;} public void setRole(String s){this.role=s;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime t){this.createdAt=t;}
}
