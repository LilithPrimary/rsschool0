const movies = document.querySelector(".movies");
const search = document.querySelector(".search");
const logo = document.querySelector(".header__logo");
const [nday, nmonth, nyear] = (new Date().toLocaleDateString()).split(".");
const nDate = new Date();
nDate.setMonth(nDate.getMonth() - 1);
const [pDay, pMonth, pYear] = (nDate.toLocaleDateString()).split(".");
const apiKey = "dac505e3f24f28b559a5d0744b792cfa";
const urlMostPop = `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${pYear}-${pMonth}-${pDay}&primary_release_date.lte=${nyear}-${nmonth}-${nday}&api_key=${apiKey}`;

async function getPost (url) {
    const response = await fetch (url);
    const data = await response.json();
    const dataAr = data.results;
    movies.innerHTML = "";
    if (dataAr.length === 0) {
        emptyResult();
    } else {
        dataAr.forEach(el => movies.append(createMovie(el)));
    }
    showDescription()
}

function showDescription() {
    const posters = document.querySelectorAll(".movie__poster");
    const descriptions = document.querySelectorAll(".description-container");
    posters.forEach(el => el.addEventListener("click", () => {
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
    // if (el.hasOwnProperty("release_date")) {
    //     [year, ...other] = el.release_date.split("-");
    // }
    // else {
    //     year = "unknown";
    // }
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

getPost(urlMostPop).catch(err => console.log("ошибочка", err));

search.addEventListener("search", (e) => {
    if (search.value !== "") {
        const value = search.value;
        getPost(`https://api.themoviedb.org/3/search/movie?query=${value}&api_key=${apiKey}`);        
        search.value = "";
    }
})
logo.addEventListener("click", () => getPost(urlMostPop).catch(err => console.log(err)));