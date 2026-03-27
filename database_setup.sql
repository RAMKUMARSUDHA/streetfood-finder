-- Run this in MySQL Workbench or MySQL CLI

CREATE DATABASE IF NOT EXISTS streetfood_db;
USE streetfood_db;

-- Admin credentials table (JPA will create other tables automatically)
CREATE TABLE IF NOT EXISTS admin_credentials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO admin_credentials (email, password, name)
VALUES ('ramkumarsudha741851@gmail.com', 'ramkumar', 'Dhanush Admin')
ON DUPLICATE KEY UPDATE name=name;

-- Insert demo customer (password = BCrypt of "password")
-- Run backend first, then use register API or insert manually
-- Demo: customer@test.com / password

SELECT 'Setup complete! Now start the backend.' as status;
