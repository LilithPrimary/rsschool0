const grid = document.querySelector(".grid");
const textCont = document.querySelector(".text-container");
const cells = document.querySelectorAll(".cell");
const title = document.querySelector(".text");
const button = document.querySelector(".button");
const crossLine = document.querySelector(".cross-line");
const headerTitle = document.querySelector(".title");
let array = [0, 0, 0, 0, 0, 0, 0, 0, 0]
let counter = 0;
const zero = "assets/svg/zero.svg";
const cross = "assets/svg/cross.svg";

grid.addEventListener ("click", e => {
    if (counter < 9) {
        if (e.target.classList.contains("cell")) {
            addSign(e.target);
            checkWinner();
        } 
    } 
})

function addSign(element) {
    if (!element.contains(element.lastElementChild)) {
        const img = document.createElement("img");
        img.classList.add("sign");
        img.src = counter % 2 === 0 ? cross : zero;
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
            showResult("Crosses wins", el[3]); return;
        } else if (cells[el[0]].id === "zero" && cells[el[1]].id === "zero" && cells[el[2]].id === "zero") {
            showResult("Zeros wins", el[3]); return;
        }
    }
    if (counter === 9) {
        showResult("DRAW", ""); return;
    }
}

function showResult(result, line) {
    if (line != "") {
        crossLine.classList.add(line);
    }
    title.textContent = result;
    setTimeout(() => {
        grid.classList.add("hide");
        textCont.classList.remove("hide");
        if (line != "") {
            crossLine.classList.remove(line);
        }
    }, 500)
}

button.addEventListener("click", () => newGame());
headerTitle.addEventListener("click", () => newGame());

function newGame() {
    cells.forEach(el => {
        el.innerHTML = "";
        el.id = "null";
    });
    counter = 0;
    grid.classList.remove("hide");
    textCont.classList.add("hide");
}