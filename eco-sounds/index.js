const img = document.querySelector(".main__image");
const menuLinks = document.querySelectorAll("[data-bird]");
const player = document.querySelector("audio");
const playBtn = document.querySelector(".button__play");
const dnldLink = document.querySelector(".download");
const burger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav")
let isPlay = false;

menuLinks.forEach(el => el.addEventListener("click", (e) =>{
    let bird = e.target.dataset.bird;
    let current = document.querySelector(".is_active");
    nav.classList.remove("is_open");
    burger.classList.remove("open");
    if (e.target.dataset.bird !== current.dataset.bird) {
        current.classList.remove("is_active")
        e.target.classList.add("is_active");
        changeBird(bird);
    }
}))

playBtn.addEventListener("click", playPause);

function changeBird (bird) {
    img.classList.add("hidden");
    setTimeout(() => {
        img.src = `assets/img/${bird}.jpg`;
        img.classList.remove("hidden");
    }, 300);
    player.src = `assets/audio/${bird}.mp3`;
    dnldLink.href = `assets/audio/${bird}.mp3`;
    if (isPlay) {
        player.play();
    }
}

function playPause () {
    if (isPlay) {
        player.pause();
        isPlay = false;
        playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#play"
    } else {
        player.play();
        isPlay = true;
        playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#pause"
    }
}

burger.addEventListener ("click", () => {
    burger.classList.toggle("open");
    nav.classList.toggle("is_open");
})

// CACHING
["forest", "nightingale", "blackbird", "robin", "lark", "warbler"].forEach(el => {
      const img = new Image();
      img.src = `assets/img/${el}.jpg`;
      const audio = new Audio();
      audio.src = `assets/audio/${el}.mp3`;
  })