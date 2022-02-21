import selfscore from './assets/script/selfscore.js';
console.log(selfscore);
const wrapper = document.querySelector(".game__wrapper");
const score = document.querySelector(".score");
const canvas = document.createElement("canvas");
const playBtn = document.querySelector(".play");
const muteBtn = document.querySelector(".mute");
const input = document.querySelector("input");
wrapper.append(canvas);
const ctx = canvas.getContext("2d");
const box = 24;
if (window.screen.width > 480) {
    canvas.width = 480;
} else {
    canvas.width = Math.floor(window.screen.width / box)*box;
}
if (window.screen.height > 480) {
    canvas.height = 480;
} else {
    canvas.height = Math.floor(window.screen.height / box)*box;
}
document.querySelector(".score__wrapper").style.width = `${canvas.width}px`;
let countX = canvas.width / box;
let countY = canvas.height / box;
let dir, interval, snake, snakeHead, food, privDir, end;
let game;
let music = createMusic("./assets/audio/music.mp3");
music.loop = true;
let eatSound = createMusic("./assets/audio/eat.wav");
let looseSound = createMusic("./assets/audio/loose.wav")
let isPlay = false;
let isMute = false;
let pause = false;
let img = imgGenerator();
let playerName = "Player";
let scoreTable = [];

document.addEventListener("keydown", (e) => direction(e.keyCode));
playBtn.addEventListener("click", playPause);
muteBtn.addEventListener("click", setVolume);

function imgGenerator() {
    let img = new Image();
    img.src = `./assets/img/${Math.ceil(Math.random()*8)}.png`;
    return img;
}

document.querySelector(".score-button").addEventListener("click", showScoreTable);
function showScoreTable() {
    if (wrapper.lastElementChild.classList.contains("flag")) return;
    const tableWrapper = document.createElement("div");
    tableWrapper.classList.add("message-wrapper", "flag");
    tableWrapper.style.flexDirection = "row";
    tableWrapper.style.transform = "scale(0)";
    const scoreCopy = [...scoreTable];
    scoreCopy.sort((a, b) => a[1] - b[1]);
    let arr = scoreCopy;
    loop:
    for (let i = 0; i < 2; i++) {
        const ol = document.createElement("ol");
        ol.textContent = i == 0 ? "Best:" : "Last:";
        switch (true) {
            case arr.length === 0:
                ol.textContent = "There're no game results here yet";
                tableWrapper.append(ol);
                break loop;
            case scoreTable.length > 10:
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
        tableWrapper.append(ol);
        arr = scoreTable;
    }    
    setTimeout (() => tableWrapper.style.transform = "scale(1)", 300);
    wrapper.append(tableWrapper);
    wrapper.parentNode.addEventListener("click", () => {
        if (wrapper.lastElementChild.classList.contains("flag")) {
            tableWrapper.style.transform = "scale(0)";
            setTimeout(() => wrapper.removeChild(tableWrapper), 500)
        }
    })
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
    let prEl = {};
    end = false;
    snakeHead = Object.assign({}, snake[0]);
    for (let i = 0; i < countX; i++) {
        for (let j = 0; j < countY; j++) {
            ctx.fillStyle = (i%2 == 0 && j%2 == 0) || ((i%2 != 0 && j%2 != 0)) ? "#0F2027" : "#2C5364";
            ctx.fillRect(i*box, j*box, box, box);
        }
    }
    ctx.drawImage(img, food.x, food.y);
    snake.forEach((el, i) => {
            ctx.beginPath();
            ctx.fillStyle = i === 0? "yellow" : "#009846";
            ctx.arc(el.x + box / 2, el.y + box / 2, box / 2, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();
    })
    if (snakeHead.x === food.x && snakeHead.y === food.y) {
        food = foodCoor();
        img = imgGenerator();
        eatSound.play();
        score.textContent = +score.textContent + 1;
        interval -= 4;
    } else {
        prEl = snake.pop();
    }
    if (dir === "right") snakeHead.x += box;
    if (dir === "left") snakeHead.x -= box;
    if (dir === "up") snakeHead.y -= box;
    if (dir === "down") snakeHead.y += box;
    snake.unshift(snakeHead);
    if ((snake.length > 2 && snakeHead.x === snake[2]["x"] && snakeHead.y === snake[2]["y"]) ||
    (snake.length < 3 && snakeHead.x === prEl["x"] && snakeHead.y === prEl["y"])) { // отлавливаем, чтобы змея не ползала сама по себе
        switch (true) {
            case ["left"].includes(dir) && privDir === "up": snakeHead.y -= box; snakeHead.x += box; break;
            case ["right"].includes(dir) && privDir === "up": snakeHead.y -= box; snakeHead.x -= box; break;
            case ["left"].includes(dir) && privDir === "down": snakeHead.y += box; snakeHead.x += box; break;
            case ["right"].includes(dir) && privDir === "down": snakeHead.y += box; snakeHead.x -= box; break;
            case ["up"].includes(dir) && privDir === "left": snakeHead.x -= box; snakeHead.y += box; break;
            case ["down"].includes(dir) && privDir === "left": snakeHead.x -= box; snakeHead.y -= box; break;
            case ["up"].includes(dir) && privDir === "right": snakeHead.x += box; snakeHead.y += box; break;
            case ["down"].includes(dir) && privDir === "right": snakeHead.x += box; snakeHead.y -= box; break;
        }
    }
    if (snakeHead.x < 0 || snakeHead.x >= canvas.width || snakeHead.y < 0 || snakeHead.y >= canvas.height) {
        end = endGame();
    }
    snake.forEach((el, i) => {
        if (i != 0 && snakeHead.x === el.x && snakeHead.y === el.y) {           
            end = endGame();
        }
    })
    clearInterval(game);
    if (end) return;
    game = setInterval(drawGame, interval);
}

function endGame() {
    clearInterval(game);
    scoreTable.push([playerName, score.textContent]);
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
        looseSound.play();
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
    snake.push ({
        x: Math.floor(countX / 2)*box,
        y: Math.floor(countY / 2)*box
    });
    interval = 300;
    food = foodCoor();
    dir = "";
    privDir = "";
    drawGame();
}

let startTouch = null;
let endTouch = null;

document.addEventListener("touchstart", (e) => {
    startTouch = e;
    // let startX = e.touches[0].clientX;
    // let startY = e.touches[0].clientY;
    // console.log("start:", startX, startY);
    // document.addEventListener("touchend", (e) => {
    //     defineDirection(e, startX, startY);
    // });
})

document.addEventListener("touchmove", (e) => {
    e.preventDefault();
    // if (event) {
    //     console.log("Move deltaX: " + (e.touches[0].pageX - event.touches[0].pageX));
    //     console.log("Move deltaY: " + (e.touches[0].pageY - event.touches[0].pageY));
    // }
    endTouch = e;
}, { passive: false });

document.addEventListener("touchend", () => {
    let diffX = endTouch.touches[0].pageX - startTouch.touches[0].pageX;
    let diffY = endTouch.touches[0].pageY - startTouch.touches[0].pageY;
    let dir;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        dir = diffX < 0 ? 37 : 39;
    } else {
        dir = diffY < 0 ? 38 : 40;
    }
    direction(dir);
})

// function defineDirection(event, startX, startY) {
//     let endX = event.changedTouches[event.changedTouches.length-1].pageX;
//     let endY = event.changedTouches[event.changedTouches.length-1].pageY;
//     let dir;
//     let diffX = startX - endX;
//     let diffY = startY - endY;
//     // console.log(e.touches);

//     console.log("end:", endX, endY);
//     if (Math.abs(diffX) > Math.abs(diffY)) {
//         dir = diffX > 0 ? 37 : 39;
//     } else {
//         dir = diffY > 0 ? 38 : 40;
//     }
//     direction(dir);
// }

function direction(e) {
    privDir = dir;
    switch (true) {
        case e == 37 && dir != "right": dir = "left"; break;
        case e == 38 && dir != "down": dir = "up"; break;
        case e == 39 && dir != "left": dir = "right"; break;
        case e == 40 && dir != "up": dir = "down"; break;
        case e == 32: gamePause(); break;
    }
}

input.addEventListener("change", setPlayerName);
input.addEventListener("blur", setPlayerName);
input.addEventListener("input", () => {
    switch (true) {
        case /^[\w- ]{1,12}$/.test(input.value): input.style.border = "solid 2px green"; break;
        case input.value === "": input.removeAttribute("style"); break;
        default: input.style.border = "solid 2px red";
    }
})
function setPlayerName(){
    if (/^[\w- ]{1,12}$/.test(input.value)) {
        playerName = input.value;
        const name = document.querySelector(".player-name");
        input.classList.add("hidden");
        name.textContent = playerName;
        name.classList.remove("hidden");
        name.addEventListener("click", () => {
            name.classList.add("hidden");
            input.classList.remove("hidden");
        })
    }
}

function gamePause() {
    if (end || wrapper.lastElementChild.classList.contains("flag")) return;
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

//Sound & music
function createMusic(path) {
    let music = new Audio();
    music.src = path;
    music.volume = 0.2;
    return music;
}
function setVolume() {
    if (isMute) {
        isMute = false;
        eatSound.volume = looseSound.volume = 0.1;
        muteBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#unmute";
    } else {
        isMute = true;
        eatSound.volume = looseSound.volume = 0;
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

// Local storage
function getLocalStorage() {
    if(localStorage.getItem('scoreTable')) {
        const res = localStorage.getItem('scoreTable');
        scoreTable = JSON.parse(res);
    }
}  
function setLocalStorage() {
    localStorage.setItem('scoreTable', JSON.stringify(scoreTable));
}
window.addEventListener('load', getLocalStorage)  
window.addEventListener('beforeunload', setLocalStorage);
