package com.streetfood.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="reviews")
public class Review {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="vendor_id")
    @JsonIgnoreProperties({"user","hibernateLazyInitializer","handler"}) private Vendor vendor;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="customer_id")
    @JsonIgnoreProperties({"password","hibernateLazyInitializer","handler"}) private User customer;
    private Integer rating;
    private String comment;
    private Boolean approved=false;
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist public void pre(){if(createdAt==null)createdAt=LocalDateTime.now();if(approved==null)approved=false;}
    public Long getId(){return id;} public void setId(Long i){this.id=i;}
    public Vendor getVendor(){return vendor;} public void setVendor(Vendor v){this.vendor=v;}
    public User getCustomer(){return customer;} public void setCustomer(User u){this.customer=u;}
    public Integer getRating(){return rating;} public void setRating(Integer r){this.rating=r;}
    public String getComment(){return comment;} public void setComment(String s){this.comment=s;}
    public Boolean getApproved(){return approved;} public void setApproved(Boolean b){this.approved=b;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime t){this.createdAt=t;}
}
