document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username") || "";
    const storedRole = localStorage.getItem("role") || "";
    const dropdownList = document.getElementById("dropdown-list");

    // Display role logic
    if (!storedRole) {
        // Fallback to fetch role from backend if not stored
        fetch(`/getRole?username=${encodeURIComponent(username)}`)
            .then(response => response.text())
            .then(role => {
                role = role.trim() || "User"; // Set default role to "User"
                updateRoleUI(role);
                localStorage.setItem("role", role); // Store the role in localStorage
            })
            .catch(error => {
                console.error("Error fetching role:", error);
                updateRoleUI("User");
            });
    } else {
        updateRoleUI(storedRole);
    }

    function updateRoleUI(role) {
        document.getElementById("user-role").textContent = role;

        // Clear previous items in dropdown
        dropdownList.innerHTML = '';

        if (role !== "User") {
            createMenuItem("Account", "account.html");
        }

        if (role.toLowerCase() === "admin") {
            createMenuItem("Admin Dashboard", "admin_dashboard.html");
            document.getElementById("admin-buttons").style.display = "block";
        } else if (role.toLowerCase() === "seller") {
            createMenuItem("Your Products", "seller_products.html");
            document.getElementById("seller-button").style.display = "block";
        } else if (role.toLowerCase() === "buyer") {
            showAddToCartButton(true);
        } else {
            createMenuItem("Home", "index.html");
        }

        createMenuItem("Log Out", "#", "logout-btn");
    }

    function createMenuItem(text, link = "#", className = "") {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link;
        a.textContent = text;
        if (className) a.classList.add(className);
        li.appendChild(a);
        dropdownList.appendChild(li);
    }

    function showAddToCartButton(show) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.classList.add('add-to-cart-button');
            if (show) {
                card.appendChild(addToCartButton);
            }
        });
    }

    window.toggleMenu = function () {
        const dropdownMenu = document.getElementById('dropdown-menu');
        dropdownMenu.classList.toggle('show');
    };

    document.body.addEventListener("click", function (event) {
        if (event.target && event.target.classList.contains("logout-btn")) {
            fetch("/logout", { method: "POST" })
                .then(response => response.text())
                .then(responseText => {
                    localStorage.clear();
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
            alert("Found " + searchResults.length + " result(s).");
        }
    });

    function simulateSearch(searchTerm) {
        const items = ["Laptop", "Phone", "Tablet", "Headphones"];
        return items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    fetch("/getProducts")
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById("products-container");
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
                container.appendChild(productCard);
            });
        })
        .catch(error => console.error("Error loading products:", error));
});
