document.addEventListener('DOMContentLoaded', function () {
    const productImageInput = document.getElementById('product-image');
    const productForm = document.getElementById('product-form');
    const submitButton = productForm.querySelector('button');
    const messageElement = document.getElementById('message');

    function showMessage(msg, color = 'red') {
        messageElement.textContent = msg;
        messageElement.style.color = color;
        messageElement.style.display = 'block';
    }

    function clearMessage() {
        messageElement.textContent = '';
        messageElement.style.display = 'none';
    }

    // Image preview
    productImageInput.addEventListener('change', function () {
        const file = productImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgPreview = document.createElement('img');
                imgPreview.src = e.target.result;
                imgPreview.style.width = '200px';
                imgPreview.style.height = '200px';
                imgPreview.style.objectFit = 'cover';
                document.getElementById('image-preview-container').innerHTML = '';
                document.getElementById('image-preview-container').appendChild(imgPreview);
            };
            reader.readAsDataURL(file);
        }
    });

    // Enable submit when form is valid
    productForm.addEventListener('input', function () {
        submitButton.disabled = !productForm.checkValidity();
    });

    // Submit handler
    productForm.addEventListener('submit', function (event) {
        event.preventDefault();
        clearMessage();

        const name = document.getElementById('product-name').value.trim();
        const description = document.getElementById('product-description').value.trim();
        const price = document.getElementById('product-price').value.trim();
        const quantity = document.getElementById('product-quantity').value.trim();
        const imageFile = document.getElementById('product-image').files[0];
        const username = sessionStorage.getItem('username');

        if (!username) {
            showMessage('You must be logged in to add a product.');
            return;
        }

        if (!imageFile) {
            showMessage('Please select an image for the product.');
            return;
        }

        const imageUrl = imageFile.name; // For now, assume image name is used

        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('image', imageUrl);
        formData.append('username', username);

        fetch('/api/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('Product added successfully!', 'green');
                productForm.reset();
                document.getElementById('image-preview-container').innerHTML = '';
                submitButton.disabled = true;
            } else {
                showMessage('Error adding product: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('[DEBUG] Fetch error:', error);
            showMessage('Error adding product.');
        });
    });
});