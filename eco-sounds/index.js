const img = document.querySelector(".main__image");
const menuLinks = document.querySelectorAll("[data-bird]");

menuLinks.forEach(el => el.addEventListener("click", (e) =>{
    let bird = e.target.dataset.bird;
    let current = document.querySelector(".is_active");
    if (e.target.dataset.bird !== current.dataset.bird) {
        current.classList.remove("is_active")
        e.target.classList.add("is_active");
        changeBird(bird);
    }
}))

function changeBird (bird) {
    img.classList.add("hidden");
    setTimeout(() => {
        img.src = `assets/img/${bird}.jpg`;
        img.classList.remove("hidden");
    }, 300);
}