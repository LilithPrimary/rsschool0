import selfscore from "./assets/script/selfscore.js";
console.log(selfscore);
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
const winCombination = [
    [0, 4, 8, "l7"],
    [2, 4, 6, "l8"],
    [0, 1, 2, "l1"],
    [3, 4, 5, "l2"],
    [6, 7, 8, "l3"],
    [0, 3, 6, "l4"],
    [1, 4, 7, "l5"],
    [2, 5, 8, "l6"]
];
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
let player, human, computer, cell, string;
let fillCell = 0;

resultsBtn.addEventListener("click", () => showResultsTable());

function showResultsTable() {
    const container = document.createElement("div");
    container.classList.add("res-container");
    const ol = document.createElement("ol");
    switch (true) {
        case results.length === 0:
            ol.textContent = "There're no game results here yet";
            break;
        case results.length > 10:
            for (let i = results.length - 1; i >= results.length - 10; i--) {
                let li = document.createElement("li");
                li.textContent = results[i];
                ol.append(li);
            }
            break;
        default:
            for (let i = results.length - 1; i >= 0; i--) {
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
    console.log("START comptern string:", string)
    if (win || player !== "computer" || counter === 9) return;
    switch (true) {
        case fillCell === 0:
            let arr = firstMove();
            string = arr[0];
            cell = arr[1];
            fillCell++;
            break;
        case fillCell === 1:
            cell = secondMove(string); fillCell++; break;
        default:
            cell = thirdMove(string); fillCell = 0;
    }   
    let check = checkHuman();
    if (check !== "empty") {
        cell = check;
        fillCell = 0;
    }
    check = checkOpportunities(); 
    cell = check === "empty" ? cell : check;
    if (cell === "empty") {
        fillCell = 0;
        cell = randomMove();
    }
    console.log("END comptern string:", string)
    console.log("to addSign:", cells[cell], "cell:", cell);
    setTimeout(() => {
                addSign(cells[cell]);
                checkWinner();
                player = "human";
            }, 300);
}

function checkHuman() {
    for (let element of winCombination){
        let counter = 0;
        for (let i = 0; i < 3; i ++) {
            if (cells[element[i]].id === human) counter ++;
        }
        if (counter === 2) {
            for (let i = 0; i < 3; i++) {
                if (![human, computer].includes(cells[element[i]].id)) {
                    return element[i];
                }
            }
        }
    }
    return "empty";
}

function checkOpportunities() {
    for (let element of winCombination){
        let counter = 0;
        for (let i = 0; i < 3; i ++) {
            if (cells[element[i]].id === computer) counter ++;
        }
        if (counter === 2) {
            for (let i = 0; i < 3; i++) {
                if (![human, computer].includes(cells[element[i]].id)) {
                    return element[i];
                }
            }
        }
    }
    return "empty";
}

function firstMove() {
    let counter = 0;
    for (let el of winCombination){
        if (cells[el[0]].id === "null" && cells[el[1]].id === "null" && cells[el[2]].id === "null") {
            if ([0, 1].includes(counter)) {
                return [el, el[1]];
            } else {
                return [el, el[0]];
            }
        }
        counter++;
    }
    return ["empty", "empty"];
}

function secondMove(element) {
    console.log("secondMove:", element);
    if (element === winCombination[0] || element === winCombination[1]) {
        if (cells[element[0]].id === "null" && cells[element[2]].id === "null") return element[0];
    } else {
        if (cells[element[0]].id === "null" && cells[element[2]].id === "null") return element[1];
    }
    return "empty";
}

function thirdMove(element) {
    console.log("thirdMove:", element);
    if (cells[element[2]].id === "null") return element[2];
    return "empty";
}

function randomMove() {
    console.log("random move");
    let c = Math.floor(Math.random()*9);
    if (cells[c].contains(cells[c].lastElementChild)) {
        c = randomMove();
    }
    console.log(c);
    return c;
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
    title.textContent = result +` in ${counter} steps`;
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
    fillCell = 0;
    counter = 0;
    win = false;
    grid.classList.remove("hide");
    textCont.classList.add("hide");
    if (player === "computer") {
        computer = "cross";
        human = "zero";
        compTurn();
    } else {
        computer = "zero";
        human = "cross";
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