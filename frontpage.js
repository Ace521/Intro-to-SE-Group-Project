document.addEventListener("DOMContentLoaded", function () {
  const userRole = "Seller"; // Dynamically set the role (e.g., from backend or session/localStorage)
  document.getElementById("user-role").textContent = userRole;

  // Show role-specific buttons
  if (userRole === "Admin") {
      document.getElementById("admin-buttons").style.display = "block";
      document.getElementById("cart-link").style.display = "none"; // Admins typically don't need a cart view
  } else if (userRole === "Seller") {
      document.getElementById("seller-button").style.display = "block";
      document.getElementById("cart-link").style.display = "none"; // Sellers also don't need the cart
  } else if (userRole === "Buyer") {
      document.getElementById("cart-link").style.display = "block";
  }

  // Handle search functionality
  document.getElementById("search-form").addEventListener("submit", handleSearch);

  // Dynamically populate the dropdown menu based on user role
  const dropdownList = document.getElementById("dropdown-list");

  function createMenuItem(text, link = "#", className = "") {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link;
      a.textContent = text;
      if (className) a.classList.add(className);
      li.appendChild(a);
      dropdownList.appendChild(li);
  }

  if (userRole === "Buyer" || userRole === "Admin") {
      createMenuItem("Account", "account.html");
      createMenuItem("Log Out", "#", "logout-btn");
  } else if (userRole === "Seller") {
      createMenuItem("Account", "account.html");
      createMenuItem("Your Products", "seller_products.html");
      createMenuItem("Log Out", "#", "logout-btn");
  }

  // Fetch and display products only for Buyers and Sellers
  if (userRole === "Buyer" || userRole === "Seller") {
      fetchProducts();
  }

  // Fetch products from the backend (assuming an API is available)
  async function fetchProducts() {
    // Simulate products as mock data
    const products = [
        { id: 1, name: "Table", description: "This is a wood table", image: "Product 1.webp", price: 100.00, quantity: 20 },
        { id: 2, name: "Chair", description: "This is a roller chair", image: "Product 2.png", price: 150.00, quantity: 15 },
        { id: 3, name: "Stool", description: "This is a barstool", image: "Product 3.jpg", price: 200.00, quantity: 10 }
    ];

    displayProducts(products);
}

    // Handle logout functionality
    document.querySelectorAll(".logout-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            // Clear any session or localStorage data if necessary
            localStorage.clear(); // Clears all localStorage data
            // Redirect to index.html
            window.location.href = "index.html";
        });
    });

  // Display products in the container
  function displayProducts(products) {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
        `;

        // Check if the user is a seller or buyer and conditionally add the "Add to Cart" button
        if (userRole === "Buyer") {
            productCard.innerHTML += `
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
        }

        productCard.innerHTML += `</div>`; // Close product details
        productsContainer.appendChild(productCard);
    });
}

  // Add product to the cart
  function addToCart(productId) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if product already exists in the cart, if so, update quantity
      const existingProductIndex = cart.findIndex(item => item.id === productId);

      if (existingProductIndex !== -1) {
          cart[existingProductIndex].quantity += 1;  // Increment the quantity if the product already exists
      } else {
          cart.push({ id: productId, quantity: 1 });  // Add new product to the cart
      }

      // Save updated cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update cart count in the UI
      updateCartCount();
  }

  // Update the cart count from localStorage
  function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const cartCount = document.getElementById('cart-count');
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Sum up all quantities of items in the cart
      cartCount.textContent = totalItems; // Update cart count with the total number of items in the cart
  }

  // Initialize cart count on page load
  updateCartCount();

  // Handle search functionality
  function handleSearch(event) {
      event.preventDefault();
      const searchTerm = document.getElementById('search-input').value.trim();
      if (!searchTerm) {
          return;
      }
      const searchResults = simulateSearch(searchTerm);
      if (searchResults.length === 0) {
          window.location.href = "search_fail.html";
      } else {
          alert("Found " + searchResults.length + " result(s).");
      }
  }

  // Simulate a search function (replace with actual search logic)
  function simulateSearch(searchTerm) {
      const items = ["Laptop", "Phone", "Tablet", "Headphones"];
      return items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
  }
});

function toggleMenu() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  dropdownMenu.classList.toggle('show');
}