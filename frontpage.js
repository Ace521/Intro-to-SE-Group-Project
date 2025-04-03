function toggleMenu() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.classList.toggle('show');  // Toggle the 'show' class
  }

  function addToCart(itemCount) {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = itemCount;
  }
  
  // Simulate adding items to the cart
  addToCart(0); 

  