// script.js

// Initialize Local Storage data for parts and cart
let parts = JSON.parse(localStorage.getItem('parts')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elements
const partForm = document.getElementById('part-form');
const partNameInput = document.getElementById('part-name');
const partPriceInput = document.getElementById('part-price');
const partQuantityInput = document.getElementById('part-quantity');
const partList = document.getElementById('part-list');
const cartItems = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Load parts and cart on page load
loadParts();
updateCart();

// Add or update a part
partForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const partId = document.getElementById('part-id').value;
    const partName = partNameInput.value;
    const partPrice = parseFloat(partPriceInput.value);
    const partQuantity = parseInt(partQuantityInput.value);

    if (partId) {
        // Update part
        const partIndex = parts.findIndex(part => part.id == partId);
        parts[partIndex].name = partName;
        parts[partIndex].price = partPrice;
        parts[partIndex].quantity = partQuantity;
    } else {
        // Add new part
        const newPart = {
            id: Date.now(),
            name: partName,
            price: partPrice,
            quantity: partQuantity
        };
        parts.push(newPart);
    }

    // Save to LocalStorage and reset form
    localStorage.setItem('parts', JSON.stringify(parts));
    loadParts();
    partForm.reset();
    document.getElementById('part-id').value = '';
});

// Load parts into the part list
function loadParts() {
    partList.innerHTML = '';  // Clear existing parts

    parts.forEach(part => {
        const partDiv = document.createElement('div');
        partDiv.classList.add('part-item');
        partDiv.innerHTML = `
            <span>${part.name} - $${part.price.toFixed(2)} (Qty: ${part.quantity})</span>
            <div>
                <button class="edit" onclick="editPart(${part.id})">Edit</button>
                <button class="delete" onclick="deletePart(${part.id})">Delete</button>
                <button onclick="addToCart(${part.id})">Add to Cart</button>
            </div>
        `;
        partList.appendChild(partDiv);
    });
}

// Edit a part
function editPart(id) {
    const part = parts.find(part => part.id === id);
    document.getElementById('part-id').value = part.id;
    partNameInput.value = part.name;
    partPriceInput.value = part.price;
    partQuantityInput.value = part.quantity;
}

// Delete a part
function deletePart(id) {
    parts = parts.filter(part => part.id !== id);
    localStorage.setItem('parts', JSON.stringify(parts));
    loadParts();
}

// Add a part to the cart
function addToCart(partId) {
    const part = parts.find(part => part.id === partId);

    const cartItem = cart.find(item => item.id === partId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...part, quantity: 1 });
    }

    updateCart();
}

// Update cart and display items
function updateCart() {
    cartItems.innerHTML = '';  // Clear current cart items
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <span>${item.name} - $${(item.price * item.quantity).toFixed(2)} (Qty: ${item.quantity})</span>
            <div>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItemDiv);
    });

    totalPriceElement.innerText = totalPrice.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Remove an item from the cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Handle checkout
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const totalPrice = totalPriceElement.innerText;
    alert(`Checkout successful! Total: $${totalPrice}`);

    // Clear the cart after checkout
    cart = [];
    updateCart();
});

// Add or update a part with validation for price and quantity
partForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const partId = document.getElementById('part-id').value;
    const partName = partNameInput.value.trim();
    const partPrice = parseFloat(partPriceInput.value);
    const partQuantity = parseInt(partQuantityInput.value);

    // Validation
    if (!partName || partPrice <= 0 || partQuantity <= 0) {
        alert("Please enter a valid part name, price (greater than 0), and quantity (greater than 0).");
        return;
    }

    if (partId) {
        // Update part
        const partIndex = parts.findIndex(part => part.id == partId);
        parts[partIndex].name = partName;
        parts[partIndex].price = partPrice;
        parts[partIndex].quantity = partQuantity;
    } else {
        // Add new part
        const newPart = {
            id: Date.now(),
            name: partName,
            price: partPrice,
            quantity: partQuantity
        };
        parts.push(newPart);
    }

    // Save to LocalStorage and reset form
    localStorage.setItem('parts', JSON.stringify(parts));
    loadParts();
    partForm.reset();
    document.getElementById('part-id').value = '';
});

// Add a part to the cart with stock management
function addToCart(partId) {
    const part = parts.find(part => part.id === partId);

    // Check if enough stock is available
    if (part.quantity <= 0) {
        alert("This part is out of stock!");
        return;
    }

    const cartItem = cart.find(item => item.id === partId);

    if (cartItem) {
        // Check if the requested quantity exceeds available stock
        if (cartItem.quantity >= part.quantity) {
            alert("Not enough stock available!");
            return;
        }
        cartItem.quantity++;
    } else {
        cart.push({ ...part, quantity: 1 });
    }

    // Reduce the stock of the part in the parts list
    part.quantity--;

    updateCart();
    loadParts(); // Refresh the part list to update available stock
}

// Load parts into the part list with stock info
function loadParts() {
    partList.innerHTML = '';  // Clear existing parts

    parts.forEach(part => {
        const partDiv = document.createElement('div');
        partDiv.classList.add('part-item');
        partDiv.innerHTML = `
            <span>${part.name} - $${part.price.toFixed(2)} (Stock: ${part.quantity})</span>
            <div>
                <button class="edit" onclick="editPart(${part.id})">Edit</button>
                <button class="delete" onclick="deletePart(${part.id})">Delete</button>
                <button onclick="addToCart(${part.id})" ${part.quantity <= 0 ? 'disabled' : ''}>Add to Cart</button>
            </div>
        `;
        partList.appendChild(partDiv);
    });
}

// Handle checkout with stock adjustment
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const totalPrice = totalPriceElement.innerText;
    alert(`Checkout successful! Total: $${totalPrice}`);

    // Clear the cart after checkout
    cart = [];
    updateCart();

    // Save updated part data after checkout (to reflect reduced stock)
    localStorage.setItem('parts', JSON.stringify(parts));
});
