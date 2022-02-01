const movies = document.querySelector(".movies");
const search = document.querySelector(".search");
const logo = document.querySelector(".header__logo");
const urlMostPop = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c";

async function getPost (url) {
    const response = await fetch (url);
    const data = await response.json();
    const dataAr = data.results;
    movies.innerHTML = "";
    dataAr.forEach(el => movies.append(createMovie(el)));
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
    moviePoster.style.backgroundImage = `url("https://image.tmdb.org/t/p/w1280${el.poster_path}")`
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
    let [year, month, day] = el.release_date.split("-");
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

getPost(urlMostPop).catch(err => console.log(err));

search.addEventListener("search", (e) => {
    if (search.value !== "") {
        const value = search.value;
        getPost(`https://api.themoviedb.org/3/search/movie?query=${value}&api_key=3fd2be6f0c70a2a598f084ddfb75487c`);
        search.value = "";
    }
})
logo.addEventListener("click", () => getPost(urlMostPop).catch(err => console.log(err)));