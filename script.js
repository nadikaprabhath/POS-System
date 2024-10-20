// script.js

// Mock product data (in real case, this might be fetched from an API)
const products = [
    { id: 1, name: "Product A", price: 20.00 },
    { id: 2, name: "Product B", price: 35.50 },
    { id: 3, name: "Product C", price: 15.00 },
];

// Initialize cart from LocalStorage if available, else create an empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load products and display them in the product list
function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';  // Clear the product list before adding new ones

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <span>${product.name} - $${product.price.toFixed(2)}</span>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        // Increase quantity if the product is already in the cart
        cartItem.quantity++;
    } else {
        // Add new product to the cart
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }

    updateCart();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart items and total price
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';  // Clear current cart items
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <span>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItemDiv);
    });

    // Update total price display
    document.getElementById('total-price').innerText = totalPrice.toFixed(2);

    // Save cart to localStorage to persist it
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Handle checkout
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const totalPrice = document.getElementById('total-price').innerText;
    alert(`Checkout successful! Total: $${totalPrice}`);
    
    // Clear the cart after checkout
    cart = [];
    updateCart();
});

// Load products on page load
loadProducts();
updateCart();

// Filter products based on the search query
function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
    
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';  // Clear the product list before adding filtered ones

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <span>${product.name} - $${product.price.toFixed(2)}</span>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Call the function on page load to initialize the full product list
loadProducts();

// Update cart items and total price (with quantity adjustment buttons)
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';  // Clear current cart items
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <span>${item.name} - $${(item.price * item.quantity).toFixed(2)}</span>
            <div>
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItemDiv);
    });

    // Update total price display
    document.getElementById('total-price').innerText = totalPrice.toFixed(2);

    // Save cart to localStorage to persist it
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Increase the quantity of a product in the cart
function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    }
    updateCart();
}

// Decrease the quantity of a product in the cart (minimum 1)
function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
    }
    updateCart();
}
