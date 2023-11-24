var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const showMoreButton = document.querySelector(".show-more");
const preloader = document.querySelector(".spinner");
const phone = document.getElementById("phone");
const nameEl = document.getElementById("name");
const callbackForm = document.getElementById("callback");
const successForm = document.querySelector(".form__success");
const closeSuccessFormButton = document.querySelector(".form__success-close");
const API_KEY = "P3RTS9G-2YH4XAV-QWKVWAZ-E9XFFDQ";
const API_MOVIES_URL = "https://api.kinopoisk.dev/v1.4/movie?rating.imdb=8-10";
let minNumberLength = 18;
let minNameLength = 3;
function getMovies(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY,
            },
        });
        const respData = yield response.json();
        showMovies(respData);
    });
}
function showMovies(data) {
    const moviesEl = document.querySelector(".movies");
    if (data.docs) {
        data.docs.forEach((movie) => {
            const movieEl = document.createElement("li");
            movieEl.classList.add("movie");
            movieEl.innerHTML = `
                <picture class="movie__cover">
                    <img class="movie__image" src="${movie.backdrop.previewUrl}" alt="${movie.name}" />
                </picture>
                <p class="movie__title">${movie.name}</p>
            `;
            moviesEl.appendChild(movieEl);
        });
    }
}
function validation(form) {
    function removeError(input) {
        const parent = input.parentElement;
        if (parent.classList.contains("error")) {
            parent.querySelector(".form__error").remove();
            parent.classList.remove("error");
        }
    }
    function createError(input, text) {
        const parent = input.parentElement;
        const errorLabel = document.createElement("label");
        errorLabel.classList.add("form__error");
        errorLabel.textContent = text;
        parent.classList.add("error");
        parent.append(errorLabel);
    }
    let result = true;
    const allInputs = form.querySelectorAll("input");
    for (const input of allInputs) {
        removeError(input);
        if (input.type == "tel" && input.value.length < 18) {
            removeError(input);
            createError(input, "Неверный номер телефона!");
            result = false;
        }
        if (input.dataset.required == "true") {
            if (input.value == "" || input.value.length < minNameLength) {
                removeError(input);
                createError(input, "Заполните поле");
                result = false;
            }
        }
    }
    return result;
}
function prefixNumber(str) {
    if (str === "7") {
        return "7 (";
    }
    if (str === "8") {
        return "8 (";
    }
    if (str === "9") {
        return "7 (9";
    }
    return "7 (";
}
phone.addEventListener("input", (e) => {
    const value = phone.value.replace(/\D+/g, "");
    minNumberLength = 11;
    let result;
    if (phone.value.includes("+8") || phone.value[0] === "8") {
        result = "";
    }
    else {
        result = "+";
    }
    for (let i = 0; i < value.length && i < minNumberLength; i++) {
        switch (i) {
            case 0:
                result += prefixNumber(value[i]);
                continue;
            case 4:
                result += ") ";
                break;
            case 7:
                result += "-";
                break;
            case 9:
                result += "-";
                break;
            default:
                break;
        }
        result += value[i];
    }
    phone.value = result;
});
nameEl.addEventListener("input", function (e) {
    nameEl.value = nameEl.value.replace(/[0-9]/g, "");
});
nameEl.addEventListener("keydown", function (e) {
    if (e.key.match(/[0-9]/))
        return e.preventDefault();
});
showMoreButton.addEventListener("click", function () {
    return __awaiter(this, void 0, void 0, function* () {
        preloader.classList.add("spinner_show");
        yield getMovies(API_MOVIES_URL);
        preloader.classList.remove("spinner_show");
        this.remove();
    });
});
closeSuccessFormButton.addEventListener("click", function () {
    successForm.classList.remove("form__success_show");
});
callbackForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validation(this) === true) {
        callbackForm.reset();
        successForm.classList.add("form__success_show");
    }
});
