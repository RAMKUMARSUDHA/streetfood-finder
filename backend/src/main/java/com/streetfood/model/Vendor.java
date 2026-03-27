package com.streetfood.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="vendors")
public class Vendor {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="user_id")
    @JsonIgnoreProperties({"password","hibernateLazyInitializer","handler"}) private User user;
    private String shopName,ownerName,ownerEmail,ownerPhone,city,address,category,description,photoUrl;
    private String openingTime,closingTime,priceRange="BUDGET",status="PENDING";
    private Boolean isLive=false;
    private Double lat,lng,avgRating=0.0;
    private Integer totalReviews=0;
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist public void pre(){if(createdAt==null)createdAt=LocalDateTime.now();if(status==null)status="PENDING";if(isLive==null)isLive=false;}
    public Long getId(){return id;} public void setId(Long i){this.id=i;}
    public User getUser(){return user;} public void setUser(User u){this.user=u;}
    public String getShopName(){return shopName;} public void setShopName(String s){this.shopName=s;}
    public String getOwnerName(){return ownerName;} public void setOwnerName(String s){this.ownerName=s;}
    public String getOwnerEmail(){return ownerEmail;} public void setOwnerEmail(String s){this.ownerEmail=s;}
    public String getOwnerPhone(){return ownerPhone;} public void setOwnerPhone(String s){this.ownerPhone=s;}
    public String getCity(){return city;} public void setCity(String s){this.city=s;}
    public String getAddress(){return address;} public void setAddress(String s){this.address=s;}
    public String getCategory(){return category;} public void setCategory(String s){this.category=s;}
    public String getDescription(){return description;} public void setDescription(String s){this.description=s;}
    public String getPhotoUrl(){return photoUrl;} public void setPhotoUrl(String s){this.photoUrl=s;}
    public String getOpeningTime(){return openingTime;} public void setOpeningTime(String s){this.openingTime=s;}
    public String getClosingTime(){return closingTime;} public void setClosingTime(String s){this.closingTime=s;}
    public String getPriceRange(){return priceRange;} public void setPriceRange(String s){this.priceRange=s;}
    public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
    public Boolean getIsLive(){return isLive;} public void setIsLive(Boolean b){this.isLive=b;}
    public Double getLat(){return lat;} public void setLat(Double d){this.lat=d;}
    public Double getLng(){return lng;} public void setLng(Double d){this.lng=d;}
    public Double getAvgRating(){return avgRating;} public void setAvgRating(Double d){this.avgRating=d;}
    public Integer getTotalReviews(){return totalReviews;} public void setTotalReviews(Integer i){this.totalReviews=i;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime t){this.createdAt=t;}
}
