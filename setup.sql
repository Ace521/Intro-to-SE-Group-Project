CREATE DATABASE lounge_sloth;
USE lounge_sloth;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('Buyer', 'Seller', 'Admin') NOT NULL
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0,
    
    image_url VARCHAR(255),
    seller_id INT,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

ALTER TABLE users
MODIFY role ENUM('Buyer', 'Seller', 'Admin') NULL;

