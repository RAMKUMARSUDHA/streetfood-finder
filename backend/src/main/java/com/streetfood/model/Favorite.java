package com.streetfood.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="favorites")
public class Favorite {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="customer_id")
    @JsonIgnoreProperties({"password","hibernateLazyInitializer","handler"}) private User customer;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="vendor_id")
    @JsonIgnoreProperties({"user","hibernateLazyInitializer","handler"}) private Vendor vendor;
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist public void pre(){if(createdAt==null)createdAt=LocalDateTime.now();}
    public Long getId(){return id;} public void setId(Long i){this.id=i;}
    public User getCustomer(){return customer;} public void setCustomer(User u){this.customer=u;}
    public Vendor getVendor(){return vendor;} public void setVendor(Vendor v){this.vendor=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime t){this.createdAt=t;}
}
