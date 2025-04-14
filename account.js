const editButton = document.getElementById('edit-username');
const editForm = document.getElementById('edit-form');
const saveButton = document.getElementById('save-changes');
const cancelButton = document.getElementById('cancel-edit');
const deleteButton = document.getElementById('deletebtn');
const modal = document.getElementById('id01');

const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');
const balanceElement = document.getElementById('balance');
const userRoleElement = document.getElementById('user-role');
const userIdElement = document.getElementById('user-id');

// Open modal to confirm account deletion
function openDeleteModal() {
    modal.style.display = 'block';
}
function closeDeleteModal() {
    modal.style.display = 'none';
}

// Fetch user data from backend
window.onload = function() {
    const token = localStorage.getItem('jwt-token'); // Get JWT from localStorage (if logged in)

    // Fetch the user data
    fetch('/api/user/me', { // Get the logged-in user's data
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Dynamically populate user data
        document.getElementById('username').textContent = data.username; // Set username dynamically
        document.getElementById('password').textContent = '*'.repeat(data.password.length); // Hide password
        document.getElementById('user-role').textContent = data.role; // Set user role
        document.getElementById('user-id').textContent = data.id; // Set user ID
        document.getElementById('balance').textContent = `$${data.balance.toFixed(2)}`; // Set balance
        
        // Show the balance section only for Buyers or Sellers
        if (data.role === 'Buyer' || data.role === 'Seller') {
            document.getElementById('balance-section').style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
};

// Edit Info
editButton.addEventListener('click', () => {
    editForm.style.display = 'block';
});

cancelButton.addEventListener('click', () => {
    editForm.style.display = 'none';
});

// Save updated username/password
saveButton.addEventListener('click', () => {
    const newUsername = document.getElementById('new-username').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const token = localStorage.getItem('jwt-token');

    const body = {};
    if (newUsername) body.username = newUsername;
    if (newPassword) body.password = newPassword;

    if (!newUsername && !newPassword) {
        alert('Please provide a new username or password.');
        return;
    }

    fetch('/api/user/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Update failed');
        }
        return response.json();
    })
    .then(data => {
        alert('Information updated successfully.');
        location.reload(); // Reload page to show updated info
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Could not update account. Please try again.');
    });

    editForm.style.display = 'none';
});

// Delete account
function deleteAccount() {
    const token = localStorage.getItem('jwt-token');

    fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Account deleted successfully.');
            localStorage.removeItem('jwt-token');
            window.location.href = 'index.html';
        } else {
            alert('Failed to delete account.');
        }
    })
    .catch(error => {
        console.error('Error deleting account:', error);
        alert('An error occurred. Please try again.');
    });
}