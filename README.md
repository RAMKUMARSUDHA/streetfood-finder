# 🍜 Street Food Finder

## SETUP INSTRUCTIONS

### Step 1: MySQL Setup
Run these SQL commands in MySQL Workbench:

```sql
CREATE DATABASE IF NOT EXISTS streetfood_db;
USE streetfood_db;

CREATE TABLE IF NOT EXISTS admin_credentials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Start Backend
```
cd backend
mvn clean spring-boot:run
```
Backend runs on: http://localhost:8080

### Step 3: Start Frontend
```
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

---

## FRONTEND PAGES TO ADD

Copy these files from the chat conversation:

1. src/index.css
2. src/App.jsx
3. src/pages/Login.jsx
4. src/pages/RegisterCustomer.jsx
5. src/pages/RegisterVendor.jsx
6. src/pages/VendorDetail.jsx
7. src/pages/customer/CustomerDashboard.jsx
8. src/pages/vendor/VendorDashboard.jsx
9. src/pages/admin/AdminHome.jsx
10. src/pages/admin/AdminVendors.jsx
11. src/pages/admin/AdminUsers.jsx
12. src/pages/admin/AdminReviews.jsx

---

