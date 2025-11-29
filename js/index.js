import { renderOrderList } from "./app.js";
import fetchBurgers from "./fetchBurgers.js";
import fetchDrinks from "./fetchDrinks.js";
import fetchFries from "./fetchFries.js";
import fetchItems from "./fetchItems.js";

const root = document.getElementById("root");

let customerData = [];
let customerSession = localStorage.getItem("loggedInCustomer");

if (customerSession != null) {
    const customerString = JSON.parse(customerSession);
    customerData.push(customerString);
}

let posNav;
let loginNav;
let logOutNav;

fetch("components/navbar/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("header").innerHTML = html;
        posNav = document.getElementById("posNav");
        loginNav = document.getElementById("loginNav");
        logOutNav = document.getElementById("logOutNav");

        updateNav();
    });

fetch("components/footer/footer.html")
    .then(res => res.text())
    .then(html => document.getElementById("footer").innerHTML = html);

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

function loadComponent(name) {
    fetch(`components/${name}/${name}.html`)
        .then(res => res.text())
        .then(html => {
            root.innerHTML = html;

            requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });

            if (name == "home") {
                fetchBurgers();
                fetchFries();
                fetchDrinks();
            } else if (name == "pos") {
                fetchItems();
                renderOrderList();
            }
            let userName = document.getElementById("userId");
            let userIdLabel = document.getElementById("userIdLabel");
            if (customerData.length != 0) {
                userName.innerText = customerData[0].name;
                userIdLabel.classList.remove("d-none");
            } else {
                userIdLabel.classList.add("d-none");
            }
        });
}

function checkLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let spinner = document.getElementById("loginSpinner");
    spinner.classList.remove("d-none");

    fetch("../json/customer.json")
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
                localStorage.setItem("loggedInCustomer", JSON.stringify(verifiedUser));
                customerData = [verifiedUser];
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
                    customerData = [];
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