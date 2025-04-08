document.addEventListener('DOMContentLoaded', function() {
    // Sample products (this would come from your database in a real app)
    const products = [
        {
            id: 1,
            name: 'Product 1',
            description: 'This is a description for Product 1.',
            price: 25.99,
            quantity: 10,
            image: 'Product 1.webp'
        },
        {
            id: 2,
            name: 'Product 2',
            description: 'This is a description for Product 2.',
            price: 15.99,
            quantity: 5,
            image: 'Product 2.png'
        }
    ];

    // Function to display products
    function displayProducts() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear any existing content

        products.forEach(product => {
            const productBox = document.createElement('div');
            productBox.classList.add('product-box');

            productBox.innerHTML = `
                <div class="trash-icon" onclick="deleteProduct(${product.id})">
                    <i class="fa fa-trash"></i>
                </div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span>Price: $${product.price}</span><br>
                <span>Quantity: ${product.quantity}</span>
            `;
            productList.appendChild(productBox);
        });
    }

    // Function to delete product
    window.deleteProduct = function(productId) {
        // Simulate deleting the product from the array
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            products.splice(productIndex, 1); // Remove product from array
            alert('Product deleted!');
            displayProducts(); // Re-render the list after deletion
        }
    };

    // Initial display of products
    displayProducts();
});