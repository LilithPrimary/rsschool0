import tracks from './assets/script/tracks.js'

// CACHING
tracks.forEach(el => {
    const img = new Image();
    img.src = el.imgPath;
    const audio = new Audio();
    audio.src = el.audioPath;
})

const song = document.querySelector("audio");
const img = document.querySelector(".audio-player__photo");
const playBtn = document.querySelector(".button__play");
const nextBtn = document.querySelector(".button__next");
const previousBtn = document.querySelector(".button__previous");
const downloadLink = document.querySelector(".download");
const shuffleBtn = document.querySelector(".shuffle");
const singer = document.querySelector(".audio-singer");
const title = document.querySelector(".audio-title");
const time = document.querySelector(".time");
const progress = document.querySelector(".audio-player__progress");
const psBar = document.querySelector(".audio-player__progress-bar");
let trackNum = -1;
let isPlay = false;
let isShuffle = false;
let inc = true;
let audioPlay;

function shuffle () {
    let val = Math.floor(Math.random()*tracks.length);
    if (val === trackNum) {
        val = shuffle ();
    }
    return val
}

function setTrack () {
    if (isShuffle) {
        trackNum = shuffle();
    } else {
        inc ? trackNum++ : trackNum--;
        trackNum = trackNum >= tracks.length ? 0 : trackNum;
        trackNum = trackNum < 0 ? tracks.length - 1 : trackNum;
    }
    img.style.backgroundImage = `url(${tracks[trackNum].imgPath})`;
    song.src = tracks[trackNum].audioPath;
    singer.textContent = tracks[trackNum].singer;
    title.textContent = tracks[trackNum].track;
    downloadLink.href = tracks[trackNum].audioPath;
}

function pause () {
    song.pause();
    isPlay = false;
    playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#play";
    // clearInterval(audioPlay);
}

function play () {
    song.play();
    isPlay = true;
    playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#pause";
    audioPlay = setInterval(() => {
        time.textContent = foo();        
        function foo () {
            let min = Math.floor(song.duration/60);
            let sec = Math.floor(60 * (song.duration/60 - min));
            let curMin = Math.floor(song.currentTime/60)
            let curSec = Math.floor(60 * (song.currentTime/60 - curMin));
            min = min < 10 ? "0" + min : min;
            sec = sec < 10 ? "0" + sec : sec;
            curMin = curMin < 10 ? "0" + curMin : curMin;
            curSec = curSec < 10 ? "0" + curSec : curSec;
            return `${curMin}:${curSec} / ${min}:${sec}`
        }
        progress.style.width = `${song.currentTime*100/song.duration}%`;
        if (song.currentTime === song.duration) {
            setTrack();
            play();
        }
    }, 10); 
}

playBtn.addEventListener("click", () => {
    isPlay ? pause() : play ();
});
nextBtn.addEventListener("click", () => {
    inc = true;
    setTrack();
    isPlay ? play() : pause();
});
previousBtn.addEventListener("click", () => {
    inc = false;
    setTrack();
    isPlay ? play() : pause();
});
shuffleBtn.addEventListener("click", () => {
    isShuffle = isShuffle ? false : true;
    shuffleBtn.classList.toggle("is_active");
});
psBar.addEventListener("click", (e) => {
    let x = e.pageX;
    let position = psBar.getBoundingClientRect();
    let xStart = position.left;
    let xEnd = position.right;
    song.currentTime = song.duration*(x - xStart) / (xEnd-xStart);
});

window.addEventListener('load', setTrack);
    
