import selfscore from './assets/script/selfscore.js';
import cards from './assets/script/cards.js';

console.log(selfscore);
const gameField = document.querySelector(".game__wrapper");
const button = document.querySelector(".button");
const player1 = document.querySelector(".player1").lastElementChild;
const player2 = document.querySelector(".player2").lastElementChild;
const playBtn = document.querySelector(".play");
const muteBtn = document.querySelector(".mute");
const ngBtn = document.querySelector(".header__title");
let player = player1;
let match, noMatch, draw, winSound, music;
let isPlay = false;
let isMute = true;
let result = [];
const playersName = [player1.previousElementSibling, player2.previousElementSibling];

playersName.forEach(el => el.addEventListener("click", (e) =>{
    const input = document.createElement("input");
    input.type = "text";
    input.value = e.target.textContent;
    e.target.parentNode.insertAdjacentElement('afterbegin', input);
    e.target.style.display = "none";
    input.addEventListener("input", ()=> {
        switch (true) {
            case /^[\w-]{1,7}$/.test(input.value): input.style.borderBottom = "solid 2px green"; break;
            case input.value === "": input.removeAttribute("style"); break;
            default: input.style.borderBottom = "solid 2px red";
        }
    })
    input.addEventListener("blur", complitInput);
    input.addEventListener("change", complitInput);
    function complitInput(event) {
        if (e.target.parentNode.firstElementChild.tagName === "INPUT" && /^[\w-]{1,7}$/.test(input.value)) {
            e.target.textContent = input.value;
            e.target.style.display = "block"; 
            input.parentNode.removeChild(input);
        } 
    }
}))

ngBtn.addEventListener("click", () => newGame());
ngBtn.nextElementSibling.addEventListener("click", showScoreTable)
button.addEventListener("click", () => newGame());

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

function showScoreTable() {
    if (gameField.parentNode.lastElementChild.classList.contains("flag")) return;
    const tableWrapper = document.createElement("div");
    tableWrapper.classList.add("flag", "info-table", "hidden");
    tableWrapper.style.flexDirection = "row";
    console.log(result);
    const resCopy = [...result];
    console.log(resCopy);
    resCopy.sort((a, b) => a[1] - b[1]);
    console.log(resCopy);
    let arr = resCopy;
    loop:
    for (let i = 0; i < 2; i++) {
        const ol = document.createElement("ol");
        ol.textContent = i == 0 ? "Best:" : "Last:";
        switch (true) {
            case arr.length === 0:
                ol.textContent = "There're no game results here yet";
                tableWrapper.append(ol);
                break loop;
            case arr.length > 10:
                for (let i = arr.length - 1; i >= arr.length - 10; i--) {
                    let li = document.createElement("li");
                    let span1 = document.createElement("span");
                    span1.textContent = arr[i][0]
                    let span2 = document.createElement("span");
                    span2.textContent = `score: ${arr[i][1]}`;
                    span2.style.color = "rgb(99,28,108)";
                    span2.style.fontWeight = 700;
                    li.append(span1, span2)
                    ol.append(li);
                };
                break;
            default:
                for (let i = arr.length - 1; i >= 0; i--) {
                    let li = document.createElement("li");
                    let span1 = document.createElement("span");
                    span1.textContent = arr[i][0]
                    let span2 = document.createElement("span");
                    span2.textContent = `score: ${arr[i][1]}`;
                    span2.style.color = "rgb(99,28,108)";
                    span2.style.fontWeight = 700;
                    li.append(span1, span2)
                    ol.append(li);
                };
        }
        arr = result;
        tableWrapper.append(ol);
    }
    setTimeout(() => tableWrapper.classList.remove("hidden"), 300)
    gameField.parentNode.append(tableWrapper);
    gameField.parentNode.addEventListener("click", () => {
        if (gameField.parentNode.lastElementChild.classList.contains("flag")) {
            tableWrapper.classList.add("hidden")
            setTimeout(() => gameField.parentNode.removeChild(tableWrapper), 700)
        }
    })
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
            button.previousElementSibling.textContent = "DRAW! One more time?";
            result.push([`DRAW!`, `10`]); break;
        case +player1.textContent > +player2.textContent:
            setTimeout(() => winSound.play(), 1000);
            button.previousElementSibling.textContent = `Player 1 wins with score ${player1.textContent}! One more time?`; 
            result.push([playersName[0].textContent, player1.textContent]); break;
        default:
            setTimeout(() => winSound.play(), 1000);
            button.previousElementSibling.textContent = `Player 2 wins with score ${player2.textContent}! One more time?`;
            result.push([playersName[1].textContent, player2.textContent]);
    }
    setTimeout(() => {
        button.parentNode.classList.remove("hidden");
    }, 1000)
    console.log(result);
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


// Sound & music
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
playBtn.addEventListener("click", () => playPause());
muteBtn.addEventListener("click", () => setVolume());
sound();

// Local storage
function getLocalStorage() {
    if(localStorage.getItem('result')) {
        const res = localStorage.getItem('result');
        result = JSON.parse(res);
    }
}  
function setLocalStorage() {
    localStorage.setItem('result', JSON.stringify(result));
}
window.addEventListener('load', getLocalStorage)  
window.addEventListener('beforeunload', setLocalStorage);