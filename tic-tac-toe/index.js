const grid = document.querySelector(".grid");
const textCont = document.querySelector(".text-container");
const cells = document.querySelectorAll(".cell");
const title = document.querySelector(".text");
const button = document.querySelectorAll(".button");
const crossLine = document.querySelector(".cross-line");
const headerTitle = document.querySelector(".title");
const zeroSound = document.querySelector(".zero-sound");
const crossSound = document.querySelector(".cross-sound");
const finishSound = document.querySelector(".finish-sound");
const music = document.querySelector(".bg-sound");
const playBtn = document.querySelector(".button__play");
const resultsBtn = document.querySelector(".result");
music.volume = 0.1;
music.loop = true;
zeroSound.volume = 0.2;
crossSound.volume = 0.2;
finishSound.volume = 0.2;
let results = [];
let isPlay = false;
let win = false;
let counter = 0;
const zero = "./assets/svg/zero.svg";
const cross = "./assets/svg/cross.svg";
let player;

resultsBtn.addEventListener("click", () => showResultsTable());

function showResultsTable() {
    const container = document.createElement("div");
    container.classList.add("res-container");
    const ol = document.createElement("ol");
    if (results.length < 10) {
        for (let i = results.length - 1; i >= 0; i--) {
            let li = document.createElement("li");
            li.textContent = results[i];
            ol.append(li);
        }
    } else {
        for (let i = results.length - 1; i >= results.length - 10; i--) {
            let li = document.createElement("li");
            li.textContent = results[i];
            ol.append(li);
        }
    }
    container.append(ol);
    grid.parentNode.append(container);
    grid.parentNode.parentNode.addEventListener("click", () => {
        if (grid.parentNode.lastElementChild.classList.contains("res-container")) {
            grid.parentNode.removeChild(container);
        }
    })
}

grid.addEventListener ("click", (e) => {
    if (counter < 9 && !win && player === "human" && !e.target.contains(e.target.lastElementChild)) {
        if (e.target.classList.contains("cell")) {
            addSign(e.target);
            checkWinner();
            player = "computer";
            compTurn();
        } 
    } 
})

function compTurn() {
    if (win || player !== "computer") return;
    let cell = Math.floor(Math.random()*9);
    if (cells[cell].contains(cells[cell].lastElementChild)) {
        compTurn();
    } else {
        setTimeout(() => {
            addSign(cells[cell]);
            checkWinner();
            player = "human";
        }, 300);
    }
}

function addSign(element) {
    if (!element.contains(element.lastElementChild)) {
        const img = document.createElement("img");
        img.classList.add("sign");
        img.src = counter % 2 === 0 ? cross : zero;
        counter % 2 === 0 ? crossSound.play() : zeroSound.play();
        element.id = counter % 2 === 0 ? "cross" : "zero";
        element.append(img);
        counter++;
    }
}

function checkWinner() {
    const winCombination = [
        [0, 1, 2, "l1"],
        [3, 4, 5, "l2"],
        [6, 7, 8, "l3"],
        [0, 3, 6, "l4"],
        [1, 4, 7, "l5"],
        [2, 5, 8, "l6"],
        [0, 4, 8, "l7"],
        [2, 4, 6, "l8"]
    ];
    for (let el of winCombination) {
        if (cells[el[0]].id === "cross" && cells[el[1]].id === "cross" && cells[el[2]].id === "cross") {
            win = true;
            showResult("Crosses wins", el[3]);
            results.push(player + " | crosses")
            return;
        } else if (cells[el[0]].id === "zero" && cells[el[1]].id === "zero" && cells[el[2]].id === "zero") {
            win = true;
            showResult("Zeros wins", el[3]);
            results.push(player + " | zeros");
            return;
        }
    }
    if (counter === 9) {
        showResult("DRAW", "");
        results.push("draw");
        return;
    }
}

function showResult(result, line) {
    if (line != "") {
        crossLine.classList.add(line);
    }
    title.textContent = result;
    setTimeout(() => {
        finishSound.play();
        grid.classList.add("hide");
        textCont.classList.remove("hide");
        if (line != "") {
            crossLine.classList.remove(line);
        }
    }, 500)
}

function showButtonContainer() {
    grid.classList.add("hide");
    textCont.classList.remove("hide");
}

button.forEach(el => el.addEventListener("click", (e) => {
    newGame(e.target.id);
}));


headerTitle.addEventListener("click", () =>{
    title.textContent = "Choose";
    setTimeout(() => {
        showButtonContainer ();
    }, 500)
});

function newGame(id) {
    cells.forEach(el => {
        el.innerHTML = "";
        el.id = "null";
    });
    player = id;
    counter = 0;
    win = false;
    grid.classList.remove("hide");
    textCont.classList.add("hide");
    console.log(player);
    if (player === "computer") {
        compTurn();
    }
}
playBtn.addEventListener("click", () => playPause());
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

function getLocalStorage() {
    if(localStorage.getItem('results')) {
        const res = localStorage.getItem('results');
        results = JSON.parse(res);
    }
}  
function setLocalStorage() {
    localStorage.setItem('results', JSON.stringify(results));
}
window.addEventListener('load', getLocalStorage)  
window.addEventListener('beforeunload', setLocalStorage);
title.textContent = "Choose";
showButtonContainer();