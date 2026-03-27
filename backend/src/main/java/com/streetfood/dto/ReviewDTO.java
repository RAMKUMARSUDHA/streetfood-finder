package com.streetfood.dto;
import java.time.LocalDateTime;
public class ReviewDTO {
    private Long id,vendorId,customerId;
    private String vendorName,customerName,comment;
    private int rating; private Boolean approved; private LocalDateTime createdAt;
    public Long getId(){return id;} public void setId(Long i){this.id=i;}
    public Long getVendorId(){return vendorId;} public void setVendorId(Long i){this.vendorId=i;}
    public Long getCustomerId(){return customerId;} public void setCustomerId(Long i){this.customerId=i;}
    public String getVendorName(){return vendorName;} public void setVendorName(String s){this.vendorName=s;}
    public String getCustomerName(){return customerName;} public void setCustomerName(String s){this.customerName=s;}
    public String getComment(){return comment;} public void setComment(String s){this.comment=s;}
    public int getRating(){return rating;} public void setRating(int i){this.rating=i;}
    public Boolean getApproved(){return approved;} public void setApproved(Boolean b){this.approved=b;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime t){this.createdAt=t;}
}
