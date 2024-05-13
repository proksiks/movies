export type Movie = {
  backdrop: {
    previewUrl: string;
  };
  name: string;
};

const showMoreButton = <HTMLElement>document.querySelector(".show-more");
const preloader = <HTMLElement>document.querySelector(".spinner");
const phone = <HTMLElement>document.getElementById("phone");
const nameEl = <HTMLElement>document.getElementById("name");
const successForm = <HTMLElement>document.querySelector(".form__success");
const closeSuccessFormButton = <HTMLElement>document.querySelector(".form__success-close");

const callbackForm = <HTMLFormElement>document.getElementById("callback");

const API_KEY: string = "BP9Q4SX-8C0MNTW-H2R94KW-2ZCX4C4";
const API_MOVIES_URL: string = "https://api.kinopoisk.dev/v1.4/movie?rating.imdb=8-10";

let minNumberLength: number = 18;
let minNameLength: number = 3;

async function getMovies(url: string) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });

  const respData = await response.json();

  showMovies(respData);
}

async function loadMovie() {
  preloader.classList.add("spinner_show");
  await getMovies(API_MOVIES_URL);
  preloader.classList.remove("spinner_show");
  this.remove();
}

function showMovies(data: { docs: [] }) {
  const moviesEl = document.querySelector(".movies");

  data.docs?.forEach((movie: Movie) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const p = document.createElement("p");

    li.classList.add("movie");
    img.classList.add("movie__image");
    p.classList.add("movie__title");

    img.src = movie.backdrop?.previewUrl;
    img.alt = movie.name;

    p.append(movie.name);
    li.appendChild(img);
    li.appendChild(p);
    moviesEl.appendChild(li);
  });
}

function removeError(input: Element) {
  const parent = input.parentElement;

  if (!parent.classList.contains("error")) return;

  parent.querySelector(".form__error").remove();
  parent.classList.remove("error");
}

function createError(input: Element, text: string) {
  const parent = input.parentElement;
  const errorLabel = document.createElement("label");

  errorLabel.classList.add("form__error");
  errorLabel.textContent = text;
  parent.classList.add("error");

  parent.append(errorLabel);
}

function validation(form: Element) {
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

function prefixNumber(str: string) {
  if (str === "9") return "7 (9";
  return "7 (";
}

phone.addEventListener("input", (e) => {
  const value = (phone as HTMLInputElement).value.replace(/\D+/g, "");
  minNumberLength = 11;

  let result = "+";

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

  (phone as HTMLInputElement).value = result;
});

nameEl.addEventListener("input", function (e) {
  (nameEl as HTMLInputElement).value = (nameEl as HTMLInputElement).value.replace(/[0-9]/g, "");
});

nameEl.addEventListener("keydown", function (e) {
  if (e.key.match(/[0-9]/)) return e.preventDefault();
});

showMoreButton.addEventListener("click", loadMovie);

closeSuccessFormButton.addEventListener("click", function () {
  successForm.classList.remove("form__success_show");
});

callbackForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validation(this)) return;
  callbackForm.reset();
  successForm.classList.add("form__success_show");
});
