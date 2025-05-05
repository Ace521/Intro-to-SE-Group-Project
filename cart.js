let cart = [];

// Simulated product data
const productData = {
    id: 3,
    name: "Stool",
    description: "This is a barstool",
    image: "Product 3.jpg",
    price: 125.00
};

// Function to add an item to the cart
function addItemToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...productData, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

// Function to remove an item from the cart
function removeItemFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

// Function to clear the cart
function clearCart() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

// Function to update the cart display
function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartMessage = document.getElementById("cart-message");
    const checkoutSection = document.getElementById("checkout-section");
    const cartCount = document.getElementById("cart-count");

    cartItemsContainer.innerHTML = "";
    checkoutSection.innerHTML = "";

    if (cart.length === 0) {
        cartMessage.style.display = "block";
        cartCount.textContent = 0;
    } else {
        cartMessage.style.display = "none";
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

        let totalPrice = 0;

        cart.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-description">${item.description}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
                    <button onclick="removeItemFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
            totalPrice += item.price * item.quantity;
        });

        const checkoutButton = document.createElement("button");
        checkoutButton.textContent = "Checkout";
        checkoutButton.onclick = () => {
            clearCart();
            alert("Checkout complete!");
        };
        checkoutSection.appendChild(checkoutButton);
    }
}

// Initialize cart on page load
window.onload = function() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart();
};