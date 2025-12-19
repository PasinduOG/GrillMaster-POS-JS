export default async function fetchDrinks() {
    let res = await fetch("https://rest-grillmaster-api.vercel.app/item/drink/all");
    let data = await res.json();

    let container = document.getElementById("homeDrinksList");
    container.innerHTML = "";

    for (let i = 0; i < data.drinks.length; i++) {
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100 shadow-lg d-flex flex-column">
                    
                    <div class="image-wrapper position-relative overflow-hidden" style="padding-top: 100%;">
                        <img src="${data.drinks[i].image_url}" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="Delicious Drink">
                    </div>

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${data.drinks[i].name}</h5>
                        <div class="mt-auto d-flex justify-content-between align-items-center pt-3">
                            <span class="h5 mb-0 text-warning fw-bold">LKR ${data.drinks[i].price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}