const wrapper = document.querySelector(".game__wrapper");
const score = document.querySelector(".score");
const canvas = document.createElement("canvas");
const playBtn = document.querySelector(".play");
const muteBtn = document.querySelector(".mute");
wrapper.append(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 460;
canvas.height = 460;
const box = 20;
let countX = canvas.width / box;
let countY = canvas.height / box;
let dir, interval, snake, food;
let game;
let music = createMusic("./assets/audio/music.mp3");
music.loop = true;
let eatSound = createMusic("./assets/audio/eat.wav");
let isPlay = false;
let isMute = false;
let pause = false;

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
    let end = false;
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
        ctx.fillStyle = snakeHead.x === el.x && snakeHead.y === el.y ? "#6c0ba9" : "yellow";
        ctx.fillRect(el.x, el.y, box, box);
        if (i != 0 && snakeHead.x === el.x && snakeHead.y === el.y) {
            end = endGame();
        }
    })
    if (snakeHead.x === food.x && snakeHead.y === food.y) {
        food = foodCoor();
        eatSound.play();
        score.textContent = +score.textContent + 1;
        interval -= 4;
    } else {
        snake.pop();
    }
    if (dir === "right") snakeHead.x += box;
    if (dir === "left") snakeHead.x -= box;
    if (dir === "up") snakeHead.y -= box;
    if (dir === "down") snakeHead.y += box;
    snake.unshift(snakeHead);
    if (snakeHead.x < 0 || snakeHead.x >= canvas.width || snakeHead.y < 0 || snakeHead.y >= canvas.height) {
        end = endGame();
    }
    clearInterval(game);
    if (end) return;
    game = setInterval(drawGame, interval);
}

function endGame() {
    clearInterval(game);   
    let message = document.createElement("div");
    message.classList.add("message-wrapper");
    message.style.transform = "scale(0)";
    let scoreTitle = document.createElement("h3");
    scoreTitle.classList.add("score-title");
    scoreTitle.textContent = score.textContent;
    let text = document.createElement("p");
    text.classList.add("message");
    switch (true) {
        case +score.textContent < 20: text.textContent = "Put yourself together! One more time!"; break;
        case +score.textContent >= 40: text.textContent = "You're so COOL!! One more time?"; break;
        default: text.textContent = "Not bad! One more time?"
    }
    let btn = document.createElement("button");
    btn.classList.add("button-omt");
    btn.textContent = "Play";
    message.append(scoreTitle, text, btn);
    wrapper.append(message);
    setTimeout (() => {
        message.style.transform = "scale(1)";
    }, 300);
    btn.addEventListener("click", () => {
        newGame();
        message.style.transform = "scale(0)";
        setTimeout (() => {
            wrapper.removeChild(message);
        }, 1000);
    });
    return true;
}

function newGame() {
    score.textContent = 0;
    snake = [];
    snake[0] = {
        x: Math.floor(countX / 2)*box,
        y: Math.floor(countY / 2)*box
    }
    interval = 300;
    food = foodCoor();
    dir = "";
    drawGame();
}

function direction(e) {
    switch (true) {
        case e.keyCode == 37 && dir != "right": dir = "left"; break;
        case e.keyCode == 38 && dir != "down": dir = "up"; break;
        case e.keyCode == 39 && dir != "left": dir = "right"; break;
        case e.keyCode == 40 && dir != "up": dir = "down"; break;
        case e.keyCode == 32: gamePause();
    }
}

function gamePause() {
    if (pause) {
        pause = false;
        game = setInterval(drawGame, interval);
        wrapper.removeChild(wrapper.lastElementChild);

    } else {
        pause = true;
        clearInterval(game);
        let pauseWrap = document.createElement("div");
        pauseWrap.classList.add("message-wrapper");
        pauseWrap.style.background = "transparent";
        let text = document.createElement("h3");
        text.classList.add("score-title");
        text.textContent = "PAUSE";
        pauseWrap.append(text);
        wrapper.append(pauseWrap);
    }
}
newGame();