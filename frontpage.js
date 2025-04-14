document.addEventListener("DOMContentLoaded", function () {
    const username = sessionStorage.getItem("username");
    const dropdownList = document.getElementById("dropdown-list");
    const cartLink = document.getElementById("cart-link");
    const adminButtons = document.getElementById("admin-buttons");
    const sellerButton = document.getElementById("seller-button");
    const productsContainer = document.getElementById("products-container");

    if (!username) {
        // No user logged in, show guest view
        document.getElementById("user-role").textContent = "User";
        createMenuItem("Home", "index.html");
        return;
    }

    fetch(`/getRole?username=${encodeURIComponent(username)}`)
        .then(response => response.text())
        .then(role => {
            role = role.trim();
            if (!role || role === "Guest") role = "User";

            document.getElementById("user-role").textContent = role;

            // Common menu items
            createMenuItem("Account", "account.html");
            createMenuItem("Log Out", "#", "logout-btn");

            if (role === "Admin") {
                adminButtons.style.display = "block";
                cartLink.style.display = "none";
                productsContainer.style.display = "none";
            }

            if (role === "Seller") {
                sellerButton.style.display = "block";
                createMenuItem("Your Products", "seller_products.html");
                cartLink.style.display = "none";
                fetchProducts(false); // Show products without Add to Cart
            }

            if (role === "Buyer") {
                cartLink.style.display = "block";
                fetchProducts(true); // Show products with Add to Cart
            }
        })
        .catch(error => {
            console.error("Error fetching role:", error);
            document.getElementById("user-role").textContent = "User";
            createMenuItem("Home", "index.html");
        });

    function createMenuItem(text, link = "#", className = "") {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link;
        a.textContent = text;
        if (className) a.classList.add(className);
        li.appendChild(a);
        dropdownList.appendChild(li);
    }

    function fetchProducts(showAddToCart) {
        fetch("/getProducts")
            .then(response => response.json())
            .then(products => displayProducts(products, showAddToCart))
            .catch(error => console.error("Error loading products:", error));
    }

    function displayProducts(products, showAddToCart) {
        productsContainer.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";

            productCard.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Available:</strong> ${product.quantity}</p>
                <p><strong>Seller:</strong> ${product.seller}</p>
            `;

            if (showAddToCart) {
                const addToCartButton = document.createElement("button");
                addToCartButton.textContent = "Add to Cart";
                addToCartButton.onclick = () => addToCart(product.id);
                productCard.appendChild(addToCartButton);
            }

            productsContainer.appendChild(productCard);
        });
    }

    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
    }

    updateCartCount();

    document.body.addEventListener("click", function (event) {
        if (event.target && event.target.classList.contains("logout-btn")) {
            fetch("/logout", { method: "POST" })
                .then(response => response.text())
                .then(responseText => {
                    alert(responseText);
                    window.location.href = "index.html";
                })
                .catch(error => console.error("Error logging out:", error));
        }
    });

    document.getElementById("search-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const searchTerm = document.getElementById('search-input').value.trim();
        if (!searchTerm) return;

        const searchResults = simulateSearch(searchTerm);
        if (searchResults.length === 0) {
            window.location.href = "search_fail.html";
        } else {
            alert("Found " + searchResults.length + " result(s)." );
        }
    });

    function simulateSearch(searchTerm) {
        const items = ["Laptop", "Phone", "Tablet", "Headphones"];
        return items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    window.toggleMenu = function () {
        const dropdownMenu = document.getElementById('dropdown-menu');
        dropdownMenu.classList.toggle('show');
    };
});
