let products = [
    { id: 1, name: "Product 1", description: "Description of product 1", image: "Product 1.png", price: 100.00, quantity: 20 },
    { id: 2, name: "Product 2", description: "Description of product 2", image: "product2.jpg", price: 150.00, quantity: 15 }
];

// Function to load products into the page
function loadProducts() {
    const productsContainer = document.querySelector('.products-container');
    productsContainer.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="product-info">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                    <p><strong>Quantity:</strong> ${product.quantity}</p>
                    <button class="edit-btn" onclick="openEditModal(${product.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        `;

        productsContainer.appendChild(productCard);
    });
}

// Function to open the modal and pre-fill the product information for editing
function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Populate the modal fields with the existing product data
        document.getElementById('edit-name').value = product.name;
        document.getElementById('edit-description').value = product.description;
        document.getElementById('edit-price').value = product.price;
        document.getElementById('edit-image').value = product.image;

        // Show the modal
        document.getElementById('edit-product-modal').style.display = 'block';

        // Save the product ID in the form for later use
        document.getElementById('edit-product-form').onsubmit = function(event) {
            event.preventDefault();
            saveProductChanges(productId);
        };
    }
}

// Function to close the modal
function closeModal() {
    document.getElementById('edit-product-modal').style.display = 'none';
}

// Function to save the updated product details
function saveProductChanges(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const newName = document.getElementById('edit-name').value;
        const newDescription = document.getElementById('edit-description').value;
        const newPrice = parseFloat(document.getElementById('edit-price').value);
        const newImage = document.getElementById('edit-image').value;

        if (newName && newDescription && newPrice && newImage) {
            product.name = newName;
            product.description = newDescription;
            product.price = newPrice;
            product.image = newImage;

            loadProducts(); // Re-load the products after editing
            closeModal();   // Close the modal after saving
        }
    }
}

// Delete product function
function deleteProduct(productId) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products.splice(productIndex, 1); // Remove the product from the array
        loadProducts(); // Re-load the products after deletion
    }
}

// Initial load of products when the page is loaded
window.onload = loadProducts;