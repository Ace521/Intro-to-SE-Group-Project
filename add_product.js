document.addEventListener('DOMContentLoaded', function() {
    const productImageInput = document.getElementById('product-image');
    const productForm = document.getElementById('product-form');
    const submitButton = productForm.querySelector('button');
    
    // Image preview functionality
    productImageInput.addEventListener('change', function() {
        const file = productImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgPreview = document.createElement('img');
                imgPreview.src = e.target.result;
                imgPreview.style.width = '200px';  // Set the preview size
                imgPreview.style.height = '200px'; // Set the preview size
                imgPreview.style.objectFit = 'cover'; // Maintain aspect ratio of image

                // Clear the previous image preview (if any)
                document.getElementById('image-preview-container').innerHTML = '';
                document.getElementById('image-preview-container').appendChild(imgPreview);
            };
            reader.readAsDataURL(file);
        }
    });

    // Enable/Disable submit button based on form validity
    productForm.addEventListener('input', function() {
        const isFormValid = productForm.checkValidity();
        submitButton.disabled = !isFormValid;
    });

    // Handle form submission
    productForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('product-name').value.trim();
        const productDescription = document.getElementById('product-description').value.trim();
        const productPrice = document.getElementById('product-price').value.trim();
        const productQuantity = document.getElementById('product-quantity').value.trim();
        const productImage = document.getElementById('product-image').files[0];

        if (!productImage) {
            alert('Please select an image for the product.');
            return;
        }

        console.log('Product Name:', productName);
        console.log('Product Description:', productDescription);
        console.log('Product Price:', productPrice);
        console.log('Product Quantity:', productQuantity);
        console.log('Product Image:', productImage.name);

        // Here, you could integrate an API to save the product to the backend

        alert('Product added successfully!');

        // Optionally, reset the form
        productForm.reset();
        document.getElementById('image-preview-container').innerHTML = '';
        submitButton.disabled = true;
    });
});

productForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(productForm); // Create FormData object with all form fields

    fetch('/api/products/add', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added successfully!');
            productForm.reset();
            document.getElementById('image-preview-container').innerHTML = '';
            submitButton.disabled = true;
        } else {
            alert('Error adding product.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding product.');
    });
});