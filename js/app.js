import { allItemArray } from "./fetchItems.js";

const orderList = JSON.parse(localStorage.getItem("orders")) || [];

let customerDetails;

function selectItem(id) {
    const itemId = parseInt(id);
    const itemList = allItemArray;

    const productDetails = itemList.find(product => product.id === itemId);
    const existingItem = orderList.find(product => product.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
        saveOrders();
        calculateTotal();
    } else {
        const order = {
            id: productDetails.id,
            name: productDetails.name,
            price: productDetails.price,
            quantity: 1,
            image_url: productDetails.image_url
        }
        orderList.push(order);
        saveOrders();
        calculateTotal();
    }

    renderOrderList();
}

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orderList));
}


export function renderOrderList() {
    let container = document.getElementById("orderItemContainer");
    let grandTotal = 0;
    let card = '';

    orderList.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        card += `
            <div class="list-group-item d-flex align-items-center" data-item-id="${item.id}">
    <div class="flex-shrink-0 me-3">
        <img src="${item.image_url}" alt="Item Image" class="img-fluid rounded" style="width: 60px; object-fit: cover;">
    </div>

    <div class="flex-grow-1 d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-2">
            <div class="flex-grow-1 me-3">
                <h6 class="mb-0 fw-normal">${item.name}</h6>
                <small class="text-muted">LKR ${item.price.toFixed(2)} each</small>
            </div>

            <button class="btn btn-sm btn-outline-danger p-1" onclick="removeItem(${item.id})">
                <i class="fas fa-trash-alt fa-sm"></i>
            </button>
        </div>

        <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group btn-group-sm flex-shrink-0" role="group" aria-label="Quantity controls">
                <button class="btn btn-outline-warning text-dark" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="btn btn-warning disabled text-dark fw-bold px-3">${item.quantity}</span>
                <button class="btn btn-outline-warning text-dark" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>

            <strong class="text-warning fs-5">LKR ${itemTotal.toFixed(2)}</strong>
        </div>
    </div>
</div>
        `;
    });
    container.innerHTML = card;
    calculateTotal();
}

function updateQuantity(id, change) {
    const itemId = parseInt(id);
    const existingItem = orderList.find(item => item.id == itemId);

    if (existingItem) {
        existingItem.quantity += change;
        saveOrders();

        if (existingItem.quantity <= 0) {
            removeItem(itemId);
        } else {
            renderOrderList();
        }
        calculateTotal();
    }
}

function removeItem(id) {
    const itemId = parseInt(id);

    const index = orderList.findIndex(item => item.id == itemId);

    if (index != -1) {
        orderList.splice(index, 1);
        saveOrders();
        renderOrderList();
        calculateTotal();
    }
}

function calculateTotal() {
    let total = 0;
    let totalLabel = document.getElementById("totalPrice");
    let chargeLabel = document.getElementById("chargePrice");
    let checkoutPrice = document.getElementById("checkoutPrice");

    orderList.forEach(item => {
        if (orderList.length == 0) {
            totalLabel.innerText = "LKR 0.00";
            chargeLabel.innerText = "LKR 0.00";
            checkoutPrice.innerText = "LKR 0.00";
            return;
        }
        total += item.quantity * item.price;
    });

    totalLabel.innerText = "LKR " + total.toFixed(2);
    chargeLabel.innerText = "LKR " + total.toFixed(2);
    checkoutPrice.innerText = "LKR " + total.toFixed(2);
    return total;
}

function saveCustomerDetails() {
    let customerName = document.getElementById("customerName").value;
    let customerPhone = document.getElementById("customerPhone").value;
    let customerEmail = document.getElementById("customerEmail").value;

    const customerData = {
        name: customerName,
        phone: customerPhone,
        email: customerEmail
    };
    let customer = document.getElementById("customerNameLabel");
    customer.innerHTML = customerData.name;

    customerDetails = customerData;
}

window.selectItem = selectItem;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.calculateTotal = calculateTotal;
window.saveCustomerDetails = saveCustomerDetails;
