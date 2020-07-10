import { movies } from "./services/search.js";
import { useSession, logout } from "./session.js";
import { useMovies } from "./movies.js";

const $containerMovies = document.getElementById("container-movies");
const $loader = document.getElementById("loader");
const $formSearch = document.getElementById("form-search");
const $inputSearch = document.getElementById("input-search");
const $errorSearch = document.getElementById("error-search");
const $logoutButton = document.getElementById("logout");

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

$logoutButton.addEventListener("click", () => {
  logout();
});
