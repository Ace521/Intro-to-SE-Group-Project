document.addEventListener("DOMContentLoaded", function () {
    const username = "currentLoggedInUser"; // Replace with actual logged-in user identifier
    const dropdownList = document.getElementById("dropdown-list");

    // Fetch the user's role
    fetch(`/getRole?username=${encodeURIComponent(username)}`)
        .then(response => response.text())
        .then(role => {
            // If the role is "Guest" or empty, show "User"
            if (role === "" || role === "Guest") {
                role = "User";
            }

            // Set the role in the welcome message
            document.getElementById("user-role").textContent = role;

            // Dynamically populate the dropdown menu based on user role
            createMenuItem("Account", "account.html");

            // Based on role, show different menu items
            if (role === "Admin") {
                createMenuItem("Log Out", "#", "logout-btn");
            } else if (role === "Seller") {
                createMenuItem("Your Products", "seller_products.html");
                createMenuItem("Log Out", "#", "logout-btn");
            } else if (role === "Buyer") {
                createMenuItem("Log Out", "#", "logout-btn");
            } else {
                createMenuItem("Home", "index.html");
            }
        })
        .catch(error => {
            console.error("Error fetching role:", error);
            // Fallback if there is an error, display "User" role in the welcome message
            document.getElementById("user-role").textContent = "User";
        });

    // Function to create menu items for the dropdown
    function createMenuItem(text, link = "#", className = "") {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link;
        a.textContent = text;
        if (className) a.classList.add(className);
        li.appendChild(a);
        dropdownList.appendChild(li);
    }

    // Toggle the dropdown menu visibility when the hamburger menu is clicked
    window.toggleMenu = function() {
        const dropdownMenu = document.getElementById('dropdown-menu');
        dropdownMenu.classList.toggle('show');
    };

    // Handle logout
    document.body.addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains("logout-btn")) {
            fetch("/logout", { method: "POST" })  // Assuming the backend handles the POST request for logging out
                .then(response => response.text())
                .then(responseText => {
                    alert(responseText);  // Optionally show a logout message
                    window.location.href = "index.html";  // Redirect to the home page after logout
                })
                .catch(error => console.error("Error logging out:", error));
        }
    });

    // Handle search
    document.getElementById("search-form").addEventListener("submit", function(event) {
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
    });

    // Simulate a search function (replace with actual search logic)
    function simulateSearch(searchTerm) {
        const items = ["Laptop", "Phone", "Tablet", "Headphones"];
        return items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    }
});