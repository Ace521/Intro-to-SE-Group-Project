fetch("/api/users")
  .then(response => response.json())
  .then(users => {
    const tbody = document.querySelector("#user-table tbody");
    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.status}</td>
        <td><button onclick="alert('Ban user ${user.name}')">Ban</button></td>
      `;
      tbody.appendChild(row);
    });
  });