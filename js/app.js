import { allItemArray } from "./fetchItems.js";
import { generateInvoice } from "./index.js";

const orderList = JSON.parse(localStorage.getItem("orders")) || [];
const processedOrder = JSON.parse(localStorage.getItem("checkoutOrders")) || [];
const savedCustomers = JSON.parse(localStorage.getItem("registeredCustomers")) || [];
let totalAmount;

function generateOrderId() {
    let lastId = localStorage.getItem("lastOrderId");
    lastId = lastId ? parseInt(lastId) : 0;
    const newId = lastId + 1;
    localStorage.setItem("lastOrderId", newId);
    return String(newId).padStart(3, "0");
}

export function loadNewOrder() {
    let activeOrderId = localStorage.getItem("activeOrderId");
    if (!activeOrderId) {
        activeOrderId = generateOrderId();
        localStorage.setItem("activeOrderId", activeOrderId);
    }

    const generatedOrderId = "#" + activeOrderId;
    document.getElementById("orderIdLabel").innerText = generatedOrderId;
}

function getActiveOrderId() {
    let activeOrderId = localStorage.getItem("activeOrderId");
    if (!activeOrderId) {
        activeOrderId = generateOrderId();
        localStorage.setItem("activeOrderId", activeOrderId);
    }
    return activeOrderId;
}

function updateOrderIdLabel() {
    const orderIdLabel = document.getElementById("orderIdLabel");
    const activeOrderId = getActiveOrderId();
    orderIdLabel.innerText = "#" + activeOrderId;
}

function selectItem(id) {
    const itemId = parseInt(id);
    const itemList = allItemArray;

    const productDetails = itemList.find(product => product.id === itemId);
    const existingItem = orderList.find(product => product.id === itemId);

    const customerName = document.getElementById("customerName").value || "user";

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
        console.log(customerName);
    }

    renderOrderList();
}

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orderList));
}

function saveCustomers() {
    localStorage.setItem("registeredCustomers", JSON.stringify(savedCustomers));
}


export function renderOrderList() {
    let container = document.getElementById("orderItemContainer");
    let grandTotal = 0;
    let card = '';

    if (orderList.length == 0) {
        document.getElementById("checkoutBtn").classList.add("disabled");
    } else {
        document.getElementById("checkoutBtn").classList.remove("disabled");
    }

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
        document.getElementById("checkoutBtn").classList.add("disabled");
        saveOrders();
        renderOrderList();
        calculateTotal();
    }
}

function clearOrder() {
    orderList.length = 0;
    localStorage.removeItem("orders");
    document.getElementById("checkoutBtn").classList.add("disabled");
    renderOrderList();
    calculateTotal();
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
    totalAmount = total;
    return total;
}

export function loadAllCustomers() {
    let customerSelect = document.getElementById("customerSelect");
    customerSelect.innerHTML = `<option value="">Select Customer</option>`;

    savedCustomers.forEach(customer => {
        customerSelect.innerHTML += `<option value="${customer.phone}">${customer.name}</option>`;

        if (customerSelect.value == customer.phone) {
            document.getElementById("customerName").value = customer.name;
            document.getElementById("customerPhone").value = customer.phone;
        }
    });
    customerSelect.addEventListener("change", selectExistingCustomer);
}

function selectExistingCustomer(event) {
    const selectedPhone = event.target.value;

    if (selectedPhone === "") {
        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("submitButton").classList.add("disabled");
        return;
    }

    const selectedCustomer = savedCustomers.find(
        customer => customer.phone === selectedPhone
    );

    if (selectedCustomer) {
        document.getElementById("customerName").value = selectedCustomer.name;
        document.getElementById("customerPhone").value = selectedCustomer.phone;
        document.getElementById("customerNameLabel").innerText = selectedCustomer.name;
        document.getElementById("checkoutUserName").innerText = selectedCustomer.name;
        document.getElementById("submitButton").classList.remove("disabled");
    }
}

function saveCustomerDetails() {
    let customerName = document.getElementById("customerName").value;
    let customerPhone = document.getElementById("customerPhone").value;

    if (!(customerPhone.startsWith("0") && customerPhone.length === 10)) {
        Swal.fire({
            title: "Error!",
            text: "This phone number is not valid",
            icon: "error"
        });
        return null;
    }

    let customerData;

    if (customerName.value == "" && customerPhone.value == "") {
        customerData = {
            name: "user",
            phone: ""
        }
    } else {
        customerData = {
            name: customerName,
            phone: customerPhone
        };

        const isDuplicate = savedCustomers.find(customer =>
            customer.phone && Number(customer.phone) === Number(customerData.phone)
        );

        if (isDuplicate) {
            Swal.fire({
                title: "Error!",
                text: "Customer with this phone number already exists",
                icon: "error"
            });
        } else if (customerPhone != "") {
            savedCustomers.push(customerData);
            saveCustomers();
        }
    }

    let customer = document.getElementById("customerNameLabel");
    let checkoutCustomer = document.getElementById("checkoutUserName");

    customer.innerHTML = customerData.name;
    checkoutCustomer.innerText = customerData.name;
    loadAllCustomers();

    return customerData;
}

function checkoutOrder() {
    const customer = saveCustomerDetails();
    const amount = Number(document.getElementById("amountReceived").value);

    if (amount < totalAmount) {
        Swal.fire({
            title: "Checkout Failed!",
            text: "Insufficient Amount!",
            icon: "error"
        });
        return;
    }
    const orderId = getActiveOrderId();

    const order = {
        orderId: orderId,
        customer: customer,
        items: [...orderList],
        total: totalAmount,
        received: amount,
        change: amount - totalAmount,
        date: new Date().toLocaleString()
    }

    processedOrder.push(order);

    localStorage.setItem("checkoutOrders", JSON.stringify(processedOrder));
    Swal.fire({
        title: "Payment Successful!",
        text: `Order ID: ${orderId}\nChange: LKR ${(amount - totalAmount).toFixed(2)}`,
        icon: "success"
    });

    const paymentModal = document.getElementById("paymentModal");
    const modal = bootstrap.Modal.getInstance(paymentModal);
    if (modal) modal.hide();

    const tempOrderList = [...orderList];
    const tempOrder = order;

    clearOrder();
    localStorage.removeItem("activeOrderId");

    const newOrderId = generateOrderId();
    localStorage.setItem("activeOrderId", newOrderId);
    updateOrderIdLabel();
    generateInvoice(tempOrder, tempOrderList);
}

window.selectItem = selectItem;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.clearOrder = clearOrder;
window.calculateTotal = calculateTotal;
window.saveCustomerDetails = saveCustomerDetails;
window.checkoutOrder = checkoutOrder;
