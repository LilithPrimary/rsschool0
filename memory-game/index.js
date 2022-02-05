import cards from './assets/script/cards.js'

const gameField = document.querySelector(".game__wrapper");
const button = document.querySelector(".button");
const player1 = document.querySelector(".player1").lastElementChild;
const player2 = document.querySelector(".player2").lastElementChild;
const playBtn = document.querySelector(".play");
const muteBtn = document.querySelector(".mute");
let player = player1;
let match, noMatch, draw, winSound, music;
let isPlay = false;
let isMute = true;

sound();

document.body.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.addEventListener("click", () => newGame());
button.addEventListener("click", () => newGame());
playBtn.addEventListener("click", () => playPause());

function sound () {
    match = new Audio();
    match.src = "./assets/audio/match.wav";
    noMatch = new Audio();
    noMatch.src = "./assets/audio/no-match.wav";
    draw = new Audio();
    draw.src = "./assets/audio/draw.wav";
    winSound = new Audio();
    winSound.src = "./assets/audio/win.wav";
    music = new Audio();
    music.src = "./assets/audio/music.mp3";
    music.loop = true;
    music.volume = 0.1;
    setVolume();
}

muteBtn.addEventListener("click", () => setVolume());

function setVolume() {
    if (isMute) {
        isMute = false;
        match.volume = 0.1;
        noMatch.volume = draw.volume = winSound.volume = 0.3;
        muteBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#unmute";
    } else {
        isMute = true;
        match.volume = noMatch.volume = draw.volume = winSound.volume = 0;
        muteBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#mute"
    }
}
Array.prototype.shuffle = function() {
    for (var i = this.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = this[num];
        this[num] = this[i];
        this[i] = d;
    }
    this.sort(function() {
        return 0.5 - Math.random();
    });
    return this;
}

function fillCardArray() {
    const cardsArray = cards.concat(cards);
    return cardsArray.shuffle();
}

function fillGameField(cardAr) {
    const cardsOnField = [];
    cardAr.forEach(el => {
        const card = document.createElement("div");
        card.classList.add("card", "card__picture", "hide");
        card.id = el.id;
        card.style.backgroundImage = `url(${el.img})`;
        const img = document.createElement("img");
        img.classList.add("card", "card-back");
        img.src = "./assets/img/card-back.jpg";
        card.append(img);
        gameField.append(card);
        cardsOnField.push(card);
    });
    return cardsOnField;
}

function startGame() {
    const cardsOnField = fillGameField(fillCardArray());
    let counter = 0;
    let matchCards = [];
    let twoCards = [];
    cardsOnField.forEach(el => {
            el.addEventListener("click", () => {
                el.style.pointerEvents = "none";
                if (!matchCards.includes(el)) {
                    turn(el);
                    twoCards[counter] = el;
                    counter++;
                    if (counter === 2) {                
                        gameField.style.pointerEvents = "none";
                        matchCards = checkCards (twoCards, matchCards);
                        setTimeout(() => {
                            twoCards.forEach(el => {
                                if (!matchCards.includes(el)) {
                                    turn(el);
                                    el.style.pointerEvents = "inherit";
                                }
                            });
                                gameField.style.pointerEvents = "all";
                        }, 1000);
                        counter = 0;
                    }
                }
            })
    });
}

function turn(el) {
    [el, el.firstElementChild].forEach(el => el.classList.toggle("hide"));
}

function checkCards (twoCards, matchCards) {
    if (twoCards[0].id === twoCards[1].id) {
        setTimeout(() => { 
            match.play();
        }, 500);
        matchCards.push(...twoCards);
        twoCards.forEach(el => el.style.cursor = "auto");
        player.textContent = +player.textContent + 1;
    } else {
        setTimeout(() => {
            noMatch.play();
            player.parentNode.classList.toggle("highlight"); 
            switch (player) {
                case player1: player = player2; break;
                default: player = player1;
            }
            player.parentNode.classList.toggle("highlight"); 
        }, 1100)
    }
    if (matchCards.length / 2 === cards.length) {
        win();
    }
    return matchCards;
}
function win() {
    switch (true) {
        case +player1.textContent === +player2.textContent:
            setTimeout(() => draw.play(), 1000);
            button.previousElementSibling.textContent = "DRAW! One more time?"; break;
        case +player1.textContent > +player2.textContent:
            setTimeout(() => winSound.play(), 1000);
            button.previousElementSibling.textContent = "Player 1 wins! One more time?"; break;
        default:
            setTimeout(() => winSound.play(), 1000);
            button.previousElementSibling.textContent = "Player 2 wins! One more time?";
    }
    setTimeout(() => {
        button.parentNode.classList.remove("hidden");
    }, 1000)
};

function newGame() {
    gameField.innerHTML = "";
    player1.textContent = player2.textContent = 0;
    player1.parentNode.classList.add("highlight");
    player2.parentNode.classList.remove("highlight");
    player = player1;
    startGame();
    setTimeout (() => {
        button.parentNode.classList.add("hidden");
    }, 500);
}
function playPause() {
    if (isPlay) {
        music.pause();
        isPlay = false;
        playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#play"
    } else {
        music.play();
        isPlay = true;
        playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#pause"
    }
}