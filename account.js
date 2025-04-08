const editButton = document.getElementById('edit-username'); // Edit button
const editForm = document.getElementById('edit-form'); // Edit form (hidden initially)
const saveButton = document.getElementById('save-changes'); // Save button
const cancelButton = document.getElementById('cancel-edit'); // Cancel button
const deleteButton = document.getElementById('deletebtn'); // Delete button inside modal
const modal = document.getElementById('id01'); // Modal

// Elements for username, password, balance, userRole, and userId
const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');
const balanceElement = document.getElementById('balance');
const userRoleElement = document.getElementById('role');
const userIdElement = document.getElementById('id');

// Function to toggle the edit form visibility
editButton.addEventListener('click', function() {
    // Show the edit form when the edit button is clicked
    editForm.style.display = 'block';
});

// Function to save changes to the username and password
saveButton.addEventListener('click', function() {
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    // Update username and password in the HTML if they are provided
    if (newUsername) {
        usernameElement.textContent = newUsername; // Update the username displayed on the page
    }
    if (newPassword) {
        // Display the new password as asterisks, based on its length
        passwordElement.textContent = '*'.repeat(newPassword.length);
    }

    // Hide the edit form after saving
    editForm.style.display = 'none';
});

// Function to cancel editing and hide the edit form
cancelButton.addEventListener('click', function() {
    editForm.style.display = 'none';
});

// Open the modal to delete the account
function openDeleteModal() {
    modal.style.display = 'block';
}

// Close the modal when the user clicks the "x"
function closeDeleteModal() {
    modal.style.display = 'none';
}

// Handle the delete functionality
function deleteAccount() {
    const token = localStorage.getItem('jwt-token'); // Get JWT token from localStorage
    const username = document.getElementById('username').textContent; // Get the dynamically set username from the page

    // Replace '/api/user/{username}' with your actual endpoint for deleting the account
    fetch(`/api/user/${username}`, { // Use template literals to append the username dynamically to the URL
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the JWT token for authorization
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Account deleted successfully.');
            window.location.href = "index.html"; // Redirect to home page after successful deletion
        } else {
            alert('Failed to delete account.');
        }
    })
    .catch(error => {
        console.error('Error deleting account:', error);
        alert('An error occurred. Please try again later.');
    });
}
// Fetch the user data on page load
window.onload = function() {
    const token = localStorage.getItem('jwt-token'); // Get JWT from localStorage (if logged in)

    // Fetch the user data (you might have a mechanism to get the logged-in user's username from the token)
    fetch('/api/user/${username}', { // Replace 'user123' with the dynamic username from your app
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Dynamically populate user data
        userRoleElement.textContent = role;
        usernameElement.textContent = username;
        userIdElement.textContent = id; // Dynamically set user ID
        passwordElement.textContent = '*'.repeat(password.length); // Display password as asterisks
        balanceElement.textContent = `$${balance.toFixed(2)}`; // Dynamically set balance

        // Show the balance section only for Buyers or Sellers
        if (data.role === 'Buyer' || data.role === 'Seller') {
            document.getElementById('balance-section').style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
};