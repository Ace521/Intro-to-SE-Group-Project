let cart = [];

// Function to add an item to the cart
function addItemToCart() {
    const newItem = {
        id: cart.length + 1,
        name: `Item ${cart.length + 1}`,
        price: (Math.random() * 100).toFixed(2),
    };

    // Add item to the cart array
    cart.push(newItem);

    // Update the cart display
    updateCart();
}

// Function to update the cart display
function updateCart() {
    const cartMessage = document.getElementById("cart-message");
    const cartItemsContainer = document.getElementById("cart-items");
    const checkoutSection = document.getElementById("checkout-section");

    // Clear current cart items and message
    cartItemsContainer.innerHTML = "";
    checkoutSection.innerHTML = "";

    // Show or hide the empty cart message
    if (cart.length == 0) {
        cartMessage.style.display = "block";
        // Redirect to homepage if cart is empty
        setTimeout(function() {
            window.location.href = "index.html"; // Redirect to the homepage after 2 seconds
        }, 2000); // 2 seconds delay to let the message show
    } else {
        cartMessage.style.display = "none";
        // Display cart items
        cart.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price}</span>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        // Display checkout button if items are in the cart
        const checkoutButton = document.createElement("button");
        checkoutButton.classList.add("checkout-button");
        checkoutButton.textContent = "Proceed to Checkout";
        checkoutButton.onclick = function() {
            window.location.href = "checkout.html"; // Redirect to checkout page
        };

        checkoutSection.appendChild(checkoutButton);
    }
}
function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    menu.classList.toggle('show');
}

