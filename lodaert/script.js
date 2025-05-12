const productsData = [];

// Generate 300 sample products with categories, images, prices, and descriptions
const categories = ['fruits', 'vegetables', 'grains', 'dairy', 'beverages'];
const sampleDescriptions = {
    fruits: 'Fresh and delicious fruits.',
    vegetables: 'Healthy and organic vegetables.',
    grains: 'High-quality grains for your meals.',
    dairy: 'Fresh dairy products.',
    beverages: 'Refreshing beverages to quench your thirst.'
};

function getRandomPrice(min, max) {
    return (Math.random() * (max - min) + min);
}

function getRandomCategory() {
    return categories[Math.floor(Math.random() * categories.length)];
}

function generateProducts() {
    for (let i = 1; i <= 300; i++) {
        const category = getRandomCategory();
        const product = {
            id: 'prod' + i,
            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i}`,
            category: category,
            price: parseFloat(getRandomPrice(10, 1000).toFixed(2)),
            image: `https://via.placeholder.com/150?text=Product+${i}`,
            description: sampleDescriptions[category]
        };
        productsData.push(product);
    }
}

// Save products data to localStorage for product.html to access
function saveProductsData() {
    localStorage.setItem('productsData', JSON.stringify(productsData));
}

// Render products on products.html
function renderProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
        return;
    }
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-badge">New</div>
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="stock">Stock: ${product.stock || 0}</p>
            <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productCard.querySelector('img').addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });
        productCard.querySelector('h3').addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });
        productCard.querySelector('.add-cart-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });
        productList.appendChild(productCard);
    });
}

// Filter products based on search, category, and price
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.querySelector('.category-btn.active').dataset.category;
    const maxPrice = parseFloat(document.getElementById('priceRange').value);

    const filtered = productsData.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchInput);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    renderProducts(filtered);
}

// Setup event listeners for filters
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    searchInput.addEventListener('input', filterProducts);

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts();
        });
    });

    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
        filterProducts();
    });
}

// Add product to cart in localStorage
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart.`);
    // Navigate to cart page after adding product
    window.location.href = 'cart.html';
}

// Render cart items on cart page
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalContainer = document.getElementById('cartTotal');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalContainer.textContent = '';
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.style.display = 'inline-block';

    let total = 0;
    let tableHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Details</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        tableHTML += `
            <tr data-index="${index}">
                <td><img src="${item.image}" alt="${item.name}" class="cart-product-image" /></td>
                <td>${item.name}</td>
                <td>${item.description || ''}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button class="qty-btn decrease-btn" data-index="${index}">-</button>
                    <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-index="${index}" />
                    <button class="qty-btn increase-btn" data-index="${index}">+</button>
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    cartItemsContainer.innerHTML = tableHTML;
    cartTotalContainer.textContent = 'Total: $' + total.toFixed(2);

    // Add event listeners for quantity inputs, increase/decrease buttons, and delete buttons
    const quantityInputs = cartItemsContainer.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.index);
            let newQty = parseInt(e.target.value);
            if (isNaN(newQty) || newQty < 1) {
                newQty = 1;
                e.target.value = 1;
            }
            cart[idx].quantity = newQty;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });

    const increaseButtons = cartItemsContainer.querySelectorAll('.increase-btn');
    increaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index);
            cart[idx].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });

    const decreaseButtons = cartItemsContainer.querySelectorAll('.decrease-btn');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index);
            if (cart[idx].quantity > 1) {
                cart[idx].quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        });
    });

    const deleteButtons = cartItemsContainer.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index);
            cart.splice(idx, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });
}

// Initialize products page
function initProductsPage() {
    let storedProducts = JSON.parse(localStorage.getItem('productsData'));
    if (storedProducts && storedProducts.length > 0) {
        productsData.length = 0;
        productsData.push(...storedProducts);
    } else {
        generateProducts();
        saveProductsData();
    }
    renderProducts(productsData);
    setupFilters();
}

// Run initProductsPage only if on products.html
if (document.getElementById('productList')) {
    initProductsPage();

    // Listen for localStorage changes to update products dynamically
    window.addEventListener('storage', (event) => {
        if (event.key === 'productsData') {
            let updatedProducts = JSON.parse(event.newValue);
            if (updatedProducts && updatedProducts.length > 0) {
                productsData.length = 0;
                productsData.push(...updatedProducts);
                filterProducts(); // apply current filters on updated data
            }
        }
    });
}

// Run renderCart if on cart.html
if (document.getElementById('cartItems')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderCart();

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', async () => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length === 0) {
                    alert('Your cart is empty.');
                    return;
                }

                // Calculate total amount in cents
                const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const amountInCents = Math.round(totalAmount * 100);

                try {
                    // Create a Checkout Session with the total amount
                    const response = await fetch('https://your-backend.example.com/create-checkout-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ amount: amountInCents }),
                    });

                    const session = await response.json();

                    if (session.id) {
                        // Redirect to Stripe Checkout
                        const result = await stripe.redirectToCheckout({
                            sessionId: session.id,
                        });
                        if (result.error) {
                            alert(result.error.message);
                        }
                    } else {
                        alert('Failed to create checkout session.');
                    }
                } catch (error) {
                    alert('Error during checkout: ' + error.message);
                }
            });
        }
    });
}
