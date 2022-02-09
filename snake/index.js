const wrapper = document.querySelector(".game__wrapper");
const score = document.querySelector(".score");
const canvas = document.createElement("canvas");
wrapper.append(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 460;
canvas.height = 460;
const box = 20;
const snake = [];
let food = foodCoor();
let dir = "";
snake[0] = {
    x: 0,
    y: 22*box
}

function foodCoor() {
    let food = {
        x: Math.floor(Math.random()*23)*box,
        y: Math.floor(Math.random()*23)*box
    }
    snake.forEach(el => {
        if (el.x === food.x && el.y === food.y) {
            food = foodCoor();
        }
    })
    return food;
}

function drawGame() {
    let snakeHead = {
        x: snake[0].x,
        y: snake[0].y
    }
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 24; j++) {
            ctx.fillStyle = (i%2 == 0 && j%2 == 0) || ((i%2 != 0 && j%2 != 0)) ? "#0F2027" : "#2C5364";
            ctx.fillRect(i*box, j*box, box, box);
        }
    }
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
    snake.forEach((el, i) => {
        ctx.fillStyle = snakeHead.x === el.x && snakeHead.y === el.y ? "green" : "white";
        ctx.fillRect(el.x, el.y, box, box);
        if (i != 0 && snakeHead.x === el.x && snakeHead.y === el.y) {
            endGame();
        }
    })
    if (snakeHead.x === food.x && snakeHead.y === food.y) {
        food = foodCoor();
        score.textContent = +score.textContent + 1;
    } else {
        snake.pop();
    }
    if (dir === "right") snakeHead.x += box;
    if (dir === "left") snakeHead.x -= box;
    if (dir === "up") snakeHead.y -= box;
    if (dir === "down") snakeHead.y += box;
    snake.unshift(snakeHead);
    if (snakeHead.x < 0 || snakeHead.x >= canvas.width || snakeHead.y < 0 || snakeHead.y >= canvas.height) {
        endGame();
    }
}

document.addEventListener("keydown", direction)

function endGame() {
    clearInterval(game);
}

function direction(e) {
    switch (true) {
        case e.keyCode == 37 && dir != "right": dir = "left"; break;
        case e.keyCode == 38 && dir != "down": dir = "up"; break;
        case e.keyCode == 39 && dir != "left": dir = "right"; break;
        case e.keyCode == 40 && dir != "up": dir = "down"; break;
    }
}


let game = setInterval(drawGame, 300);