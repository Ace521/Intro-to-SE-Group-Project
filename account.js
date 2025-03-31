const editButton = document.getElementById('edit-username'); // Edit button
const editForm = document.getElementById('edit-form'); // Edit form (hidden initially)
const saveButton = document.getElementById('save-changes'); // Save button
const cancelButton = document.getElementById('cancel-edit'); // Cancel button

// Elements for username and password
const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');

// Function to toggle the edit form visibility
editButton.addEventListener('click', function() {
    // Show the edit form when the edit button is clicked
    editForm.style.display = 'block';
});

// Function to save changes
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

// Function to cancel editing
cancelButton.addEventListener('click', function() {
    // Hide the edit form without saving
    editForm.style.display = 'none';
});
