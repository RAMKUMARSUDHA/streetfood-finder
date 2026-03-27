package com.streetfood.model;
import jakarta.persistence.*;
@Entity @Table(name="admin_credentials")
public class AdminCredential {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(unique=true,nullable=false) private String email;
    @Column(nullable=false) private String password;
    private String name;
    public Long getId(){return id;} public void setId(Long i){this.id=i;}
    public String getEmail(){return email;} public void setEmail(String s){this.email=s;}
    public String getPassword(){return password;} public void setPassword(String s){this.password=s;}
    public String getName(){return name;} public void setName(String s){this.name=s;}
}
