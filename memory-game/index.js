import cards from './assets/script/cards.js'

const gameField = document.querySelector(".game__wrapper");
const button = document.querySelector(".button");

document.body.firstElementChild.firstElementChild.firstElementChild.addEventListener("click", () => newGame());

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
    let mutchCards = [];
    let twoCards = [];
    cardsOnField.forEach(el => {
            el.addEventListener("click", () => {
                el.style.pointerEvents = "none";
                if (!mutchCards.includes(el)) {
                    turn(el);
                    twoCards[counter] = el;
                    counter++;
                    if (counter === 2) {                
                        gameField.style.pointerEvents = "none";
                        mutchCards = checkCards (twoCards, mutchCards);
                        setTimeout(() => {
                            twoCards.forEach(el => {
                                if (!mutchCards.includes(el)) {
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

function checkCards (twoCards, mutchCards) {
    if (twoCards[0].id === twoCards[1].id) {
        mutchCards.push(...twoCards);
        twoCards.forEach(el => el.style.cursor = "auto");
    }
    if (mutchCards.length / 2 === cards.length) {
        console.log("win");
        win();
    }
    return mutchCards;
}
function win() {
    button.previousElementSibling.textContent = "You're win! One more time?";
    setTimeout(() => {
        button.parentNode.classList.remove("hide");
    }, 1000)
};
function newGame() {
    gameField.innerHTML = "";
    startGame();
    setTimeout (() => {
        button.parentNode.classList.add("hide");
    }, 500);
}