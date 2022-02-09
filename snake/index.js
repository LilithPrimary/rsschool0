const wrapper = document.querySelector(".game__wrapper");
const score = document.querySelector(".score");
const canvas = document.createElement("canvas");
const playBtn = document.querySelector(".play");
const muteBtn = document.querySelector(".mute");
wrapper.append(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 460;
canvas.height = 460;
let interval = 300;
const box = 20;
let countX = canvas.width / box;
let countY = canvas.height / box;
let dir = "";
const snake = [];
snake[0] = {
    x: 0,
    y: (countY-1) * box
}
let food = foodCoor();
let music = createMusic("./assets/audio/music.mp3");
music.loop = true;
let eatSound = createMusic("./assets/audio/eat.wav");
let isPlay = false;
let isMute = false;

document.addEventListener("keydown", direction);
playBtn.addEventListener("click", playPause);
muteBtn.addEventListener("click", setVolume);

function setVolume() {
    if (isMute) {
        isMute = false;
        eatSound.volume = 0.1;
        muteBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#unmute";
    } else {
        isMute = true;
        eatSound.volume = 0;
        muteBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#mute"
    }
}

function createMusic(path) {
    let music = new Audio();
    music.src = path;
    music.volume = 0.2;
    return music;
}


function foodCoor() {
    let food = {
        x: Math.floor(Math.random()*countX)*box,
        y: Math.floor(Math.random()*countY)*box
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
    for (let i = 0; i < countX; i++) {
        for (let j = 0; j < countY; j++) {
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
            endGame(); return;
        }
    })
    if (snakeHead.x === food.x && snakeHead.y === food.y) {
        food = foodCoor();
        eatSound.play();
        score.textContent = +score.textContent + 1;
        interval -= 2;
    } else {
        snake.pop();
    }
    if (dir === "right") snakeHead.x += box;
    if (dir === "left") snakeHead.x -= box;
    if (dir === "up") snakeHead.y -= box;
    if (dir === "down") snakeHead.y += box;
    snake.unshift(snakeHead);
    if (snakeHead.x < 0 || snakeHead.x >= canvas.width || snakeHead.y < 0 || snakeHead.y >= canvas.height) {
        endGame(); return;
    }
    clearInterval(game);
    game = setInterval(drawGame, interval);
}



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

function playPause() {
    if (isPlay) {
        music.pause();
        isPlay = false;
        playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#play"
    } else {
        music.volume = 0.1;
        music.play();
        isPlay = true;
        playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#pause"
    }
}

let game = setInterval(drawGame, interval);