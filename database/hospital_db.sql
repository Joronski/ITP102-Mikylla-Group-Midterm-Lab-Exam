CREATE DATABASE hospital_db;

USE hospital_db;

-- Create users table
CREATE TABLE users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create categories table
CREATE TABLE categories (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    product_count INT(11) NOT NULL DEFAULT 0
);

-- Insert default user
INSERT INTO users (username, password) VALUES ('admin', MD5('admin123'));

-- Insert default categories
INSERT INTO categories (category_name, product_count) 
VALUES ('Patient Records', 0),
('Doctor Profiles', 0),
('Appointments', 0),
('Emergency Cases', 0);