import selfScore from "./assets/script/selfscore.js";
console.log(selfScore);

const movies = document.querySelector(".movies");
const search = document.querySelector(".search");
const logo = document.querySelector(".header__logo");
const [nday, nmonth, nyear] = (new Date().toLocaleDateString()).split(".");
const nDate = new Date();
nDate.setMonth(nDate.getMonth() - 1);
const [pDay, pMonth, pYear] = (nDate.toLocaleDateString()).split(".");
const apiKey = "dac505e3f24f28b559a5d0744b792cfa";
const urlMostPop = `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${pYear}-${pMonth}-${pDay}&primary_release_date.lte=${nyear}-${nmonth}-${nday}&api_key=${apiKey}`;
let urlSearch = urlMostPop;
let page = 2;

async function getPost (url) {
    const response = await fetch (url);
    const data = await response.json();
    const dataAr = data.results;
    if (dataAr.length === 0) {
        emptyResult();
    } else {
        var button = document.createElement("button");
        button.classList.add("button");
        button.textContent = "More";
        dataAr.forEach(el => movies.append(createMovie(el)));
        movies.append(button);
    }
    showDescription()
    button.addEventListener("click", (e) => morePages(e));
}

function morePages(e) {
    e.target.classList.add("remove");
    setTimeout (() => {
        e.target.parentNode.removeChild(e.target);
    }, 5000)
    getPost (urlSearch + `&page=${page}`);
    page++;   
}

function showDescription() {
    const posters = document.querySelectorAll(".movie__poster");
    const descriptions = document.querySelectorAll(".description-container");
    posters.forEach(el => el.addEventListener("click", () => {
        posters.forEach(el => {
            if (el.nextElementSibling.classList.contains("active")) {
                setTimeout (() => {
                    el.classList.add("active");
                    el.nextElementSibling.classList.remove("active");
                }, 100)
            }
        })
        el.classList.toggle("active");
        el.nextElementSibling.classList.toggle("active");
    }))
    descriptions.forEach(el => el.addEventListener("click", () => {
        el.classList.toggle("active");
        el.previousElementSibling.classList.toggle("active");
    }));
}

function createMovie(el) {
    const movie = document.createElement("div");
    movie.classList.add("movie");
    const moviePoster = document.createElement("div");
    moviePoster.classList.add("movie__poster", "active");
    try {
        moviePoster.style.backgroundImage = `url("https://image.tmdb.org/t/p/w1280${el.poster_path}")`
    }
    catch(err) {
        console.log(err);
        moviePoster.style.backgroundImage = `url("./assets/svg/favicon.svg")`;
    }
    const descriptionContainer = document.createElement("div");
    descriptionContainer.classList.add("description-container");
    const descriptionText = document.createElement("p");
    descriptionText.classList.add("description__text");
    descriptionText.textContent = el.overview;
    descriptionContainer.append(descriptionText);
    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie__info");
    const movieName = document.createElement("h3");
    movieName.classList.add("movie__name");
    movieName.textContent = el.title;
    const bottomSection = document.createElement("div");
    bottomSection.classList.add("bottom_section");
    const movieYear = document.createElement("span");
    movieYear.classList.add("movie__year");
    let year, other;
    try {
        [year, ...other] = el.release_date.split("-");
    }
    catch (err) {
        console.log(err);
        year = "unknown";
    }
    movieYear.textContent = year;
    const movieRating = document.createElement("span");
    movieRating.classList.add("movie__rating");
    movieRating.textContent = el.vote_average;
    switch (true) {
        case +el.vote_average >= 8: movieRating.style.color = "green"; break;
        case +el.vote_average <= 5: movieRating.style.color = "red"; break;
        default: movieRating.style.color = "orange";
    }
    bottomSection.append(movieYear, movieRating);
    movieInfo.append(movieName, bottomSection);
    movie.append(moviePoster, descriptionContainer, movieInfo);
    return movie;
}

function emptyResult() {
    const emptyResult = document.createElement("div");
    emptyResult.textContent = "Nothing found";
    emptyResult.style.color = "#684870";
    movies.append(emptyResult);
}
function tryLater() {
    movies.innerHTML = "";
    const emptyResult = document.createElement("div");
    emptyResult.textContent = "Someting with API. Try again later";
    emptyResult.style.color = "#684870";
    movies.append(emptyResult);
}
getPost(urlMostPop).catch(err => {
    console.log(err);
    tryLater();
});

search.addEventListener("search", (e) => {
    if (search.value !== "") {
        movies.innerHTML = "";
        page = 2;
        const value = search.value;
        urlSearch = `https://api.themoviedb.org/3/search/movie?query=${value}&api_key=${apiKey}`;
        getPost(urlSearch).catch(err => {
            console.log(err);
            tryLater();
        });        
    }
})
logo.addEventListener("click", () => {
    movies.innerHTML = "";
    urlSearch = urlMostPop;
    search.value= "";
    page = 2;
    getPost(urlMostPop).catch(err => {
        console.log(err);
        tryLater();
    });
});