export let allItemArray = [];

export default async function fetchItems(){

    let res = await fetch("https://rest-grillmaster-api.vercel.app/item/all");
    let data = await res.json();

    allItemArray = data.items;

    let container = document.getElementById("posBurgerContainer");
    container.innerHTML = "";

    data.items.forEach(item => {
        container.innerHTML += `
            <div class="col-md-3 col-sm-4 col-6" onclick="selectItem('${item._id}');">
                <div class="card h-100 shadow-lg" role="button">
                    <div class="image-container d-flex align-item-center justify-content-center bg-light"
                        style="height: 120px; overflow: hidden;">
                        <img src="${item.image_url}" class="img-fluid" alt="Classic Burger"
                            style="object-fit: cover; width: 100%; height: 100%;">
                    </div>
                    <div class="card-body text-center p-3">
                        <h6 class="card-title mb-1 small fw-bold">${item.name}</h6>
                        <p class="card-text text-warning fw-bold mb-0">LKR ${item.price}</p>
                    </div>
                </div>
            </div>
        `;
    });
}