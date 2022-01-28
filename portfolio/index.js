import i18Obj from './translate.js'

// WORK WITH BURGER MENU

const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const menuLinks = document.querySelectorAll(".menu-link");
const shadow = document.querySelector(".shadow");
const burgSpans = hamburger.querySelectorAll("span");
const toggleMenu = () => [hamburger, nav, shadow].forEach(el => el.classList.toggle("open"));
[...menuLinks, hamburger, shadow].forEach(el => el.addEventListener("click", toggleMenu));

// WORK WITH SECTION PORTFOLIO BUTTONS

["winter", "summer", "spring", "autumn"].forEach(el => {
  for(let i = 0; i < 6; i++) {
    const img = new Image();
    img.src = `assets/img/${el}/${i}.jpg`;
  }
})
const btnContainer = document.querySelector(".pButtons");
const pPhoto = document.querySelectorAll(".pPhoto");
btnContainer.addEventListener("click", (e) => {
  let current = btnContainer.querySelector(".active");
  if (e.target.tagName === "BUTTON" && e.target.dataset.season !== current.dataset.season) {
    current.classList.remove("active");
    e.target.classList.add("active");
    pPhoto.forEach(el => el.classList.add("hide-img"))
    setTimeout(() => {
      pPhoto.forEach((el, i) => el.src=`assets/img/${e.target.dataset.season}/${i}.jpg`);
      pPhoto.forEach(el => el.classList.remove("hide-img"));
    }, 500)
  }
});

// WORK WITH LIGHT THEME

const sunMoon = document.querySelector(".sun-moon");
const btns = btnContainer.querySelectorAll("button");
const lines = document.querySelectorAll(".line");
const secTitles = document.querySelectorAll(".section-title");
const htmlTage = document.querySelector("html");
const elsForSwitchTheme = [sunMoon, hamburger, nav, htmlTage, document.body, ...btns, ...lines, ...secTitles];
let theme = "dark";
sunMoon.addEventListener("click", () => {
  let sunOrMoon = sunMoon.firstElementChild.href.baseVal;
  let thm = (sunOrMoon === "./assets/svg/sprite.svg#moon") ? "light" : "dark";
  setTheme(thm);
  });
const setTheme = (thm) => {
  if (thm === "light") {
    elsForSwitchTheme.forEach(el => el.classList.add("white"));
    sunMoon.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#sun";
    theme = "light";
  } else {
    elsForSwitchTheme.forEach(el => el.classList.remove("white"));
    sunMoon.firstElementChild.href.baseVal = "./assets/svg/sprite.svg#moon";
    theme = "dark";
  }
} 

// WORK WITH LANGUAGE

const textForTransl = document.querySelectorAll("[data-i18n]");
console.log(textForTransl[44]);
const langs = document.querySelectorAll(".langRadio");
let lang = "en";
langs.forEach(el => el.addEventListener("click", (e) => {
  if (e.target.id !== lang) {
    setLang(e.target.id);
  }
}))
const setLang = (lg) => {
  textForTransl.forEach(el => {
    ["input", "textarea"].includes(el.localName) ? el.placeholder = i18Obj[lg][el.dataset.i18n] : el.textContent = i18Obj[lg][el.dataset.i18n];
  })
  lang = lg;
  langs.forEach(el => {
    if (el.id === lg) el.checked = true;
  })
}

// WORK WITH VIDEO

const play = document.querySelector(".videoBtn");
const picture = document.querySelector(".video-player");
const video = document.querySelector(".real-video");
play.addEventListener("click", ()=>{
  picture.classList.add("hide");
  video.classList.remove("hide");
  video.play();
}
)

// WORK WITH LOCALSTORAGE

function getLocalStorage() {
  if(localStorage.getItem('theme')) {
    const theme = localStorage.getItem('theme');
    setTheme(theme);
  }
  if(localStorage.getItem('lang')) {
    const lang = localStorage.getItem('lang');
    setLang(lang);
  }
}

window.addEventListener('load', getLocalStorage)

function setLocalStorage() {
  localStorage.setItem('theme', theme);
  localStorage.setItem('lang', lang);
}

window.addEventListener('beforeunload', setLocalStorage);















console.log (`
[75/75]
[+] 1. Смена изображений в секции portfolio +25
        Изображения разных времён года получаем из папок с соответствующими названиями
        Изображения можно заменить на другие с целью улучшения качества созданного приложения
        - при кликах по кнопкам Winter, Spring, Summer, Autumn в секции portfolio отображаются изображения из папки с соответствующим названием +20
        - кнопка, по которой кликнули, становится активной т.е. выделяется стилем. Другие кнопки при этом будут неактивными +5
[+] 2. Перевод страницы на два языка +25
        Для перевода можно воспользоваться файлом translate.js
        Содержание файла можно редактировать или полностью изменить с целью улучшения качества созданного приложения
        - при клике по надписи ru англоязычная страница переводится на русский язык +10
        - при клике по надписи en русскоязычная страница переводится на английский язык +10
        - надписи en или ru, соответствующие текущему языку страницы, становятся активными т.е. выделяются стилем +5
[+] 3. Переключение светлой и тёмной темы +25
        Внешний вид тёмной темы соответствует макету, который верстали в предыдущих частях задания, внешний вид светлой темы соответствует одному из двух вариантов макетов на выбор. Баллы за оба варианта одинаковые, выбирайте тот, который больше нравится.
        - Вариант первый. Блоки и секции header, hero, contacts, footer остались без изменений, в оставшихся секциях цвет фона и шрифта поменялись местами: фон стал белым, шрифт черным Макет в figma - светлая тема - 1
        - На страницу добавлен переключатель при клике по которому:
           * тёмная тема приложения сменяется светлой +10
           * светлая тема приложения сменяется тёмной +10
           * после смены светлой и тёмной темы интерактивные элементы по-прежнему изменяют внешний вид при наведении и клике и при этом остаются видимыми на странице (нет ситуации с белым шрифтом на белом фоне) +5
[+] 4. Дополнительный функционал: выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы +5
[+] 5. Дополнительный функционал: сложные эффекты для кнопок при наведении и/или клике +5
        Для получения максимального балла за пункт требований достаточно добавить кнопкам только один эффект
        Можно выбрать любой из предложенных эффектов или добавить свой собственный равноценный им по сложности
 `)