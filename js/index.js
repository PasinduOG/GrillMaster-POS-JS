const root = document.getElementById("root");
let customerData = [];

let shopNav;
let cartNav;
let loginNav;
let registerNav;
let logOutNav;

fetch("components/navbar/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("header").innerHTML = html;
        shopNav = document.getElementById("shopNav");
        cartNav = document.getElementById("cartNav");
        loginNav = document.getElementById("loginNav");
        registerNav = document.getElementById("registerNav");
        logOutNav = document.getElementById("logOutNav");

        updateNav();
    });

fetch("components/footer/footer.html")
    .then(res => res.text())
    .then(html => document.getElementById("footer").innerHTML = html);

function updateNav() {
    if (customerData.length === 0) {
        shopNav.classList.add("d-none");
        cartNav.classList.add("d-none");
        loginNav.classList.remove("d-none");
        registerNav.classList.remove("d-none");
        logOutNav.classList.add("d-none");
    } else {
        shopNav.classList.remove("d-none");
        cartNav.classList.remove("d-none");
        loginNav.classList.add("d-none");
        registerNav.classList.add("d-none");
        logOutNav.classList.remove("d-none");

    }
}

function loadComponent(name) {
    fetch(`components/${name}/${name}.html`)
        .then(res => res.text())
        .then(html => root.innerHTML = html);
}

function checkLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("../json/customer.json")
        .then(res => res.json())
        .then(data => {
            data.forEach(customer => {
                if (customer.email == email && customer.password == password) {
                    customerData.push(customer);
                    updateNav();
                    loadComponent('home');
                }
            });
        });
}

function logOut(){
    customerData = [];
    updateNav();
    loadComponent("login");
}

window.loadComponent = loadComponent;
loadComponent("home");

window.checkLogin = checkLogin;
window.logOut = logOut;