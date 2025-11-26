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
        .then(html => {
            root.innerHTML = html;
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
            data.forEach(customer => {
                if (customer.email == email && customer.password == password) {
                    spinner.classList.add("d-none");
                    customerData.push(customer);
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

window.checkLogin = checkLogin;
window.logOut = logOut;