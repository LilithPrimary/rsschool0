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
let trackNum = 0;
let isPlay = false;
let isShuffle = false;

function shuffle () {
    return Math.floor(Math.random()*tracks.length);
}

function setTrack () {
    trackNum = isShuffle ? shuffle() : trackNum;
    trackNum = trackNum >= tracks.length ? 0 : trackNum;
    trackNum = trackNum < 0 ? tracks.length - 1 : trackNum;
    img.style.backgroundImage = `url(${tracks[trackNum].imgPath})`;
    song.src = tracks[trackNum].audioPath;
    singer.textContent = tracks[trackNum].singer;
    title.textContent = tracks[trackNum].track;
    downloadLink.href = tracks[trackNum].audioPath;
}

function pause () {
    song.pause();
    isPlay = false;
    playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#play"
}

function play () {
    song.play();
    isPlay = true;
    playBtn.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#pause";
}

playBtn.addEventListener("click", () => {
    isPlay ? pause() : play ();
    let audioPlay = setInterval(() => {
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
    }, 10);
});
nextBtn.addEventListener("click", () => {
    trackNum++;
    setTrack();
    isPlay ? play() : pause();
})
previousBtn.addEventListener("click", () => {
    trackNum--;
    setTrack();
    isPlay ? play() : pause();
})
shuffleBtn.addEventListener("click", () => {
    isShuffle = isShuffle ? false : true;
    shuffleBtn.classList.toggle("is_active");
})

window.addEventListener('load', setTrack);
    
