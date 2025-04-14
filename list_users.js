document.addEventListener('DOMContentLoaded', function () {
    // Simulated list of users for the admin
    const users = [
        { username: 'user123', role: 'Buyer', id:1 },
        { username: 'user2', role: 'Seller', id:2 },
        { username: 'user3', role: 'Admin', id:3 },
        { username: 'user4', role: 'Buyer', id:4 },
    ];

    // Get the container where users will be displayed
    const userListContainer = document.querySelector('.user-list-container');

    // Function to render the users
    function renderUsers() {
    userListContainer.innerHTML = ''; // Clear the list before rendering

    users.forEach((user, index) => {
        // Create a user box
        const userBox = document.createElement('div');
        userBox.classList.add('user-box');

        // Add user info to the box
        userBox.innerHTML = `
            <h3>${user.username}</h3>
            <p>Role: ${user.role}</p>
            <p>ID: ${user.id}</p>
        `;

        // If the user is not an Admin, create the delete button
        if (user.role !== 'Admin') {
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';

            // Add delete functionality to the trash icon
            deleteBtn.addEventListener('click', () => {
                alert(`Delete button clicked for ${user.username}`); // Test alert on click
                deleteUser(index);
            });

            // Append the delete button to the user box
            userBox.appendChild(deleteBtn);
        }

        // Append the user box to the user list container
        userListContainer.appendChild(userBox);
    });
}

    // Function to delete a user (based on index)
    function deleteUser(index) {
        console.log('Before deletion:', users);  // Debugging log
        const confirmation = confirm('Are you sure you want to delete this user?');
        if (confirmation) {
            users.splice(index, 1); // Remove the user from the array
            console.log('After deletion:', users);  // Debugging log
            renderUsers(); // Re-render the users to update the DOM
        }
    }

    // Initially render the users
    renderUsers();
});