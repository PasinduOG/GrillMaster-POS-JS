export default async function fetchFries() {
    let res = await fetch("json/items.json");
    let data = await res.json();

    let container = document.getElementById("homeFriesList");
    container.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        if(data[i].product_type == "Fries"){
            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card h-100 shadow-lg d-flex flex-column">
                        
                        <div class="image-wrapper position-relative overflow-hidden" style="padding-top: 100%;">
                            <img src="${data[i].image_url}" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" alt="Delicious Burger">
                        </div>

                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold">${data[i].name}</h5>
                            <p class="card-text text-muted">${data[i].ingredients}</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center pt-3">
                                <span class="h5 mb-0 text-warning fw-bold">LKR ${data[i].price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}