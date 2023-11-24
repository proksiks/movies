const showMoreButton = <HTMLElement>document.querySelector(".show-more");
const preloader = <HTMLElement>document.querySelector(".spinner");
const phone = <HTMLElement>document.getElementById("phone");
const nameEl = <HTMLElement>document.getElementById("name");
const callbackForm = <HTMLFormElement>document.getElementById("callback");
const successForm = <HTMLElement>document.querySelector(".form__success");
const closeSuccessFormButton = <HTMLElement>document.querySelector(".form__success-close");
const minNumberLength: number = 11;
const minNameLength: number = 3;
const API_KEY: string = "P3RTS9G-2YH4XAV-QWKVWAZ-E9XFFDQ";
const API_MOVIES_URL: string = "https://api.kinopoisk.dev/v1.4/movie?rating.imdb=8-10";

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

function showMovies(data: { docs: [] }) {
  const moviesEl = document.querySelector(".movies");

  if (data.docs) {
    data.docs.forEach((movie: { backdrop: { previewUrl: string }; name: string }) => {
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

function validation(form: Element) {
  function removeError(input: Element) {
    const parent = input.parentElement;

    if (parent.classList.contains("error")) {
      parent.querySelector(".form__error").remove();
      parent.classList.remove("error");
    }
  }

  function createError(input: Element, text: string) {
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

    if (input.dataset.required == "true") {
      if (input.value == "" || input.value.length < minNameLength) {
        removeError(input);
        createError(input, "Заполните поле");
        result = false;
      }

      if (input.type == "tel" && input.value.length < minNumberLength) {
        removeError(input);
        createError(input, "Неверный номер телефона!");
        result = false;
      }
    }
  }

  return result;
}

function prefixNumber(str: string) {
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
  const value = (phone as HTMLInputElement).value.replace(/\D+/g, "");

  let result;

  if ((phone as HTMLInputElement).value.includes("+8") || (phone as HTMLInputElement).value[0] === "8") {
    result = "";
  } else {
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

  (phone as HTMLInputElement).value = result;
});

nameEl.addEventListener("input", function (e) {
  (nameEl as HTMLInputElement).value = (nameEl as HTMLInputElement).value.replace(/[0-9]/g, "");
});

nameEl.addEventListener("keydown", function (e) {
  if (e.key.match(/[0-9]/)) return e.preventDefault();
});

showMoreButton.addEventListener("click", async function () {
  preloader.classList.add("spinner_show");
  await getMovies(API_MOVIES_URL);
  preloader.classList.remove("spinner_show");
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
