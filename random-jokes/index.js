import persons from './assets/script/persons.js';
import tracks from './assets/script/persons.js'

const photoCont = document.querySelector(".photo-container");
const photo = document.querySelector(".author-photo");
const quoteCont = document.querySelector(".quote-container");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const button = document.querySelector(".header__button");
const title = document.querySelector(".header__title");
const url = "https://www.breakingbadapi.com/api/quotes";
let joke = -1;

async function getData() {
    const res = await fetch(url);
    const data = await res.json();
    showData (data);
    console.log(data);
}

function showData (data) {
    let jokeNum = setJoke();
    console.log(data[jokeNum]);
    quote.textContent = data[jokeNum].quote;
    author.textContent = `${data[jokeNum].author} ("${data[jokeNum].series}")`
    photo.style.backgroundImage = `url("./assets/img/${persons[data[jokeNum].author]}.jpg")`;
}

button.addEventListener("click", () => getData());
title.addEventListener("click", () => getData());

function setJoke () {
    let numberOfJoke = Math.floor(Math.random()*70);
    numberOfJoke = joke === numberOfJoke ? setJoke() : numberOfJoke;
    joke = numberOfJoke;
    return numberOfJoke;
}

window.addEventListener('load', () => {
    setJoke();
    getData();
});
