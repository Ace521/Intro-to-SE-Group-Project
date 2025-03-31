const items = ['Product 1', 'Product 2', 'Product 3', 'Product 4'];

function performSearch(event) {
    event.preventDefault();
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    const results = items.filter(item => item.toLowerCase().includes(searchQuery));

    const searchResultsContainer = document.getElementById('search-results');
    const noResultsMessage = document.getElementById('no-results-message');

    // Clear previous results
    searchResultsContainer.innerHTML = '';
    noResultsMessage.style.display = 'none'; // Hide "no results" message

    if (results.length > 0) {
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result-item');
            resultDiv.innerText = result;
            searchResultsContainer.appendChild(resultDiv);
        });
    } else {
        // No results found
        noResultsMessage.style.display = 'block';
    }
}

// Function to return the user to the homepage
function goHome() {
    window.location.href = 'frontpage.html'; // Change this to your homepage URL
}