// Admin page script to manage products stored in localStorage

// Load products from localStorage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('productsData')) || [];
    return products;
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('productsData', JSON.stringify(products));
}

// Render products in admin table with editable fields
function renderAdminProducts() {
    const products = loadProducts();
    const tableBody = document.querySelector('#adminProductTable tbody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover;" /></td>
            <td>${product.id}</td>
            <td contenteditable="true" class="editable" data-field="name" data-index="${index}">${product.name}</td>
            <td contenteditable="true" class="editable" data-field="category" data-index="${index}">${product.category}</td>
            <td contenteditable="true" class="editable" data-field="price" data-index="${index}">${product.price.toFixed(2)}</td>
            <td contenteditable="true" class="editable" data-field="description" data-index="${index}">${product.description}</td>
            <td>
                <button class="save-btn" data-index="${index}">Save</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Add event listeners for save and delete buttons
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', () => {
            const idx = parseInt(button.getAttribute('data-index'));
            saveProductChanges(idx);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const idx = parseInt(button.getAttribute('data-index'));
            deleteProduct(idx);
        });
    });
}

// Save changes made in editable cells for a product
function saveProductChanges(index) {
    const products = loadProducts();
    const rowCells = document.querySelectorAll(`#adminProductTable tbody tr:nth-child(${index + 1}) td.editable`);
    rowCells.forEach(cell => {
        const field = cell.getAttribute('data-field');
        let value = cell.textContent.trim();
        if (field === 'price') {
            value = parseFloat(value);
            if (isNaN(value) || value < 0) {
                alert('Please enter a valid non-negative number for price.');
                renderAdminProducts();
                return;
            }
        }
        products[index][field] = value;
    });
    saveProducts(products);
    alert('Product updated successfully.');
    renderAdminProducts();
}

// Delete product at index
function deleteProduct(index) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    const products = loadProducts();
    products.splice(index, 1);
    saveProducts(products);
    alert('Product deleted successfully.');
    renderAdminProducts();
}

// Add new product
function addNewProduct() {
    const products = loadProducts();

    // Generate new product id
    let newIdNum = 1;
    if (products.length > 0) {
        const lastId = products[products.length - 1].id;
        const match = lastId.match(/\d+$/);
        if (match) {
            newIdNum = parseInt(match[0]) + 1;
        }
    }
    const newId = 'prod' + newIdNum;

    const name = prompt('Enter product name:');
    if (!name) return alert('Product name is required.');
    const category = prompt('Enter product category:');
    if (!category) return alert('Product category is required.');
    const priceStr = prompt('Enter product price:');
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) return alert('Invalid price.');
    const image = prompt('Enter product image URL:');
    if (!image) return alert('Product image URL is required.');
    const description = prompt('Enter product description:');
    if (!description) return alert('Product description is required.');

    const newProduct = {
        id: newId,
        name,
        category,
        price,
        image,
        description
    };

    products.push(newProduct);
    saveProducts(products);
    alert('Product added successfully.');
    renderAdminProducts();
}

// Initialize admin page
window.onload = function() {
    renderAdminProducts();
    document.getElementById('addNewProductBtn').addEventListener('click', addNewProduct);
};
