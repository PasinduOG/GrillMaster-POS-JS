import { loadAllCustomers, loadNewOrder, renderOrderList } from "./app.js";
import fetchBurgers from "./fetchBurgers.js";
import fetchDrinks from "./fetchDrinks.js";
import fetchFries from "./fetchFries.js";
import fetchItems from "./fetchItems.js";

const root = document.getElementById("root");

const customerData = JSON.parse(localStorage.getItem("loggedInCustomer")) || [];

let posNav;
let loginNav;
let logOutNav;

fetch("components/navbar/navbar.html")
    .then(res => res.text())
    .then(component => {
        document.getElementById("header").innerHTML = component;
        posNav = document.getElementById("posNav");
        loginNav = document.getElementById("loginNav");
        logOutNav = document.getElementById("logOutNav");
        setUserName();
        updateNav();
    });

fetch("components/footer/footer.html")
    .then(res => res.text())
    .then(component => document.getElementById("footer").innerHTML = component);

function logToPos() {
    if (customerData.length == 0) {
        loadComponent("login");
        return;
    }
    loadComponent("pos");
}

function updateNav() {
    if (customerData.length === 0) {
        posNav.classList.add("d-none");
        loginNav.classList.remove("d-none");
        logOutNav.classList.add("d-none");
    } else {
        posNav.classList.remove("d-none");
        loginNav.classList.add("d-none");
        logOutNav.classList.remove("d-none");

    }
}

function setUserName() {
    const userName = document.getElementById("userId");
    const userIdLabel = document.getElementById("userIdLabel");

    if (!userName || !userIdLabel) return;

    if (customerData.length > 0 && customerData[0]?.name) {
        userName.innerText = customerData[0].name;
        userIdLabel.classList.remove("d-none");
    } else {
        userIdLabel.classList.add("d-none");
    }
}


function loadComponent(name, callback) {
    fetch(`components/${name}/${name}.html`)
        .then(res => res.text())
        .then(component => {
            root.innerHTML = component;

            requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });

            if (name == "home") {
                document.getElementById("header").style.display = "block";
                document.getElementById("footer").style.display = "block";
                fetchBurgers();
                fetchFries();
                fetchDrinks();
                setUserName();
            } else if (name == "pos") {
                document.getElementById("header").style.display = "block";
                document.getElementById("footer").style.display = "none";
                fetchItems();
                renderOrderList();
                loadNewOrder();
                loadAllCustomers();
            } else if (name == "invoice") {
                document.getElementById("header").style.display = "none";
                document.getElementById("footer").style.display = "none";
            }

            if (callback) {
                setTimeout(() => callback(), 10);
            }
        });
}

function goBack(name) {
    document.getElementById("header").style.display = "block";
    document.getElementById("footer").style.display = "block";
    loadComponent(name);
}

function checkLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let spinner = document.getElementById("loginSpinner");
    spinner.classList.remove("d-none");

    fetch("json/customer.json")
        .then(res => res.json())
        .then(data => {
            const loggedCustomer = data.find(customer => customer.email == email && customer.password == password);
            spinner.classList.add("d-none");
            if (loggedCustomer) {
                const verifiedUser = {
                    id: loggedCustomer.id,
                    name: loggedCustomer.name,
                    email: loggedCustomer.email
                };
                customerData.push(verifiedUser);
                localStorage.setItem("loggedInCustomer", JSON.stringify(customerData));
                updateNav();
                loadComponent('home');
            } else {
                spinner.classList.add("d-none");
                document.getElementById("alertMessage").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("alertMessage").classList.add("d-none");
                }, 3000);
            }
        });
}

function logOut() {
    Swal.fire({
        title: "Are you sure you want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, log out!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Logged out!",
                text: "Please login to the application again.",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('loggedInCustomer');
                    customerData.length = 0;
                    updateNav();
                    loadComponent("login");
                }
            });
        }
    });
}

window.loadComponent = loadComponent;
loadComponent("home");
window.logToPos = logToPos;
window.checkLogin = checkLogin;
window.logOut = logOut;
window.goBack = goBack;

export function generateInvoice(order, arr) {
    loadComponent("invoice", () => {
        let invoiceContainer = `
            <div id="printArea">
                <div class="row">
                    <div class="col-lg-8 mx-auto">
                        <div class="card shadow">
                            <div class="card-body p-5">
                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <h1 class="display-4 text-danger fw-bold">GrillMaster</h1>
                                        <p class="text-muted mb-0">Galle Rd</p>
                                        <p class="text-muted mb-0">Panadura, Kalutara</p>
                                        <p class="text-muted mb-0">Phone: +94 71 243 6642</p>
                                        <p class="text-muted">Email: info@grillmaster.com</p>
                                    </div>
                                    <div class="col-md-6 text-md-end">
                                        <h2 class="text-uppercase text-secondary">Invoice</h2>
                                        <p class="mb-1"><strong>Invoice #:</strong> INV-2025-${order.orderId}</p>
                                        <p class="mb-1"><strong>Date:</strong> ${order.date}</p>
                                        <p class="mb-1"><strong>Order #:</strong> ORD-${order.orderId}</p>
                                    </div>
                                </div>

                                <hr class="my-4">

                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <h5 class="text-uppercase text-secondary mb-3">Bill To:</h5>
                                        <p class="mb-1"><strong>${order.customer.name}</strong></p>
                                    </div>
                                    <div class="col-md-6">
                                        <h5 class="text-uppercase text-secondary mb-3">Payment Method:</h5>
                                        <p class="mb-1">${order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'Cash'}</p>
                                    </div>
                                </div>

                                <div class="table-responsive mb-4">
                                    <table class="table table-hover">
                                        <thead class="table-danger">
                                            <tr>
                                                <th scope="col">Item</th>
                                                <th scope="col" class="text-center">Quantity</th>
                                                <th scope="col" class="text-end">Unit Price (LKR)</th>
                                                <th scope="col" class="text-end">Total (LKR)</th>
                                            </tr>
                                        </thead>
                                        <tbody id="invoiceItems">`;

        arr.forEach(item => {
            const total = item.quantity * item.price;

            invoiceContainer += `
                                <tr>
                                    <td>${item.name}</td>
                                    <td class="text-center">${item.quantity}</td>
                                    <td class="text-end">${item.price.toFixed(2)}</td>
                                    <td class="text-end">${total.toFixed(2)}</td>
                                </tr>
                            `;
        });

        invoiceContainer += `</tbody>
                                    </table>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 ms-auto">
                                        <table class="table table-borderless">
                                            <tr class="border-top">
                                                <td class="text-end">
                                                    <h2 class="mb-0"><strong>Total:</strong></h2>
                                                    <hr class="my-3"/>
                                                    <h6 class="mb-0 text-secondary"><strong>Received:</strong></h6>
                                                    <h6 class="mb-0 text-secondary"><strong>Change:</strong></h6>
                                                </td>
                                                <td class="text-end">
                                                    <h2 class="mb-0 text-danger"><strong>LKR ${order.total.toFixed(2)}</strong></h2>
                                                    <hr class="my-3"/>
                                                    <h6 class="mb-0 text-danger"><strong>LKR ${order.received.toFixed(2)}</strong></h6>
                                                    <h6 class="mb-0 text-danger"><strong>LKR ${order.change.toFixed(2)}</strong></h6>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <hr class="my-4">

                            </div>
                        </div>

                        <div class="text-center mt-4">
                            <p class="text-muted mb-2">Thank you for your order!</p>
                            <p class="text-muted small mb-4">For any questions about this invoice, please contact us at
                                info@grillmaster.com</p>
                            <div class="d-flex justify-content-center">
                                <button class="btn btn-danger" onclick="printInvoice()">
                                    <i class="bi bi-printer"></i> Print Invoice
                                </button>
                            </div>
                        </div>

                        <div class="text-center mt-4">
                            <a href="#" class="btn btn-link text-decoration-none" onclick="goBack('home')">← Back to Home</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("invoiceContainer").innerHTML = invoiceContainer;
    });
}

window.printInvoice = function () {
    window.print();
};