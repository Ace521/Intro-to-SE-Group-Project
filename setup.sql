CREATE DATABASE lounge_sloth;
USE lounge_sloth;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('Buyer', 'Seller', 'Admin') NOT NULL
);

ALTER TABLE users
MODIFY role ENUM('Buyer', 'Seller', 'Admin') NULL;

