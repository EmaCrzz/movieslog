import { movies } from "./services/search.js";
import { useSession, logout } from "./session.js";
import { useMovies } from "./movies.js";

const $containerMovies = document.getElementById("container-movies");
const $loader = document.getElementById("loader");
const $formSearch = document.getElementById("form-search");
const $inputSearch = document.getElementById("input-search");
const $errorSearch = document.getElementById("error-search");
const $menuButton = document.getElementById("menu-button");
const $lightboxMenu = document.getElementById("lightbox-menu");
const $closeMenu = document.getElementById("button-lightbox-menu");

useSession();
useMovies({
  htmlContainer: $containerMovies,
  htmlError: $errorSearch,
  htmlLoader: $loader
});

$formSearch.addEventListener("submit", validateForm, false);

function validateForm(event) {
  $errorSearch.classList.add("u-is-hidden");
  event.preventDefault();
  $errorSearch.textContent = "";
  if (!$inputSearch.value) {
    $errorSearch.classList.remove("u-is-hidden");
    $errorSearch.textContent = "Insert a text to search";
    $errorSearch.classList.add("input_control_error", "generic");
  } else {
    const param = $inputSearch.value.replace(" ", "+");
    useMovies({
      htmlContainer: $containerMovies,
      htmlLoader: $loader,
      htmlError: $errorSearch,
      keyword: param
    });
  }
}

$menuButton.addEventListener("click", () => {
  // logout();
  // const htmlContent = showDetail(movieSelected);
  // $ligthBox.insertAdjacentHTML("beforeend", htmlContent);
  $lightboxMenu.classList.add("lightbox--show");
});
$closeMenu &&
  $closeMenu.addEventListener("click", () => {
    $lightboxMenu.classList.remove("lightbox--show");
  });
