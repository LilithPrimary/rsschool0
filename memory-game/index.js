import cards from './assets/script/cards.js'

const gameFild = document.querySelector(".game__wrapper");

class Card {
    constructor(cardID, imgPath, cardState) {
        this.cardID = cardID;
        this.imgPath = imgPath;
        this.cardState = cardState;
    }
    get state() {
        return this.cardState;
    }
    set state(state) {
        this.cardState = state;
    }
    get img() {
        return this.imgPath;
    }
    get id() {
        return this.cardID;
    }
}

function fillCardArray() {
    const cardsArray = [];
    cards.forEach(el => {
        cardsArray.push(new Card(el.id, el.img, "close"))
    })
    return cardsArray;
}

function fillGameFild() {
    const card = document.createElement("div");
    card.classList.add("card", "card-back");
    
}

console.log (fillCardArray());