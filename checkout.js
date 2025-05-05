document.addEventListener("DOMContentLoaded", function() {
    const product = {
        id: 3,
        name: "Stool",
        description: "This is a barstool",
        image: "Product 3.jpg",
        price: 200.00,
        quantity: 1
    };

    const cartItemsContainer = document.getElementById("cart-items");

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="cart-item-image">
        <div class="cart-item-details">
            <span class="cart-item-name">${product.name}</span>
            <span class="cart-item-description">${product.description}</span>
            <span class="cart-item-price">$${product.price.toFixed(2)}</span>
            <span class="cart-item-quantity">Quantity: ${product.quantity}</span>
            <span class="cart-item-number">Item #: 1</span>
        </div>
    `;
    cartItemsContainer.appendChild(itemDiv);

    const checkoutButton = document.getElementById("checkout-button");
    checkoutButton.addEventListener("click", function() {
        alert("Checkout successful!");
        window.location.href = "cart.html"; // Redirect to cart page
    });
});