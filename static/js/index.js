import { movies } from "./services/search.js";
import { useSession, logout } from "./session.js";
import { useMovies } from "./movies.js";

const $formSearch = document.getElementById("form-search");
const $inputSearch = document.getElementById("input-search");
const $errorSearch = document.getElementById("error-search");
const $logoutButton = document.getElementById("logout");

useSession();

$formSearch.addEventListener("submit", validateForm, false);

function validateForm(event) {
  event.preventDefault();
  $errorSearch.classList.remove("input_control_error", "generic");
  if (!$inputSearch.value) {
    $errorSearch.textContent = "Insert a text to search";
    $errorSearch.classList.add("input_control_error", "generic");
  } else {
    searchMovies();
  }
}

async function searchMovies() {
  const param = $inputSearch.value.replace(" ", "+");
  const call = await movies.searchByTitle(`s=${param}`);

  if ("Error" in call.data) {
    $errorSearch.textContent = call.data.Error;
    $errorSearch.classList.add("input_control_error", "generic");
  }

  const $containerMovies = document.getElementById("container-movies");
  useMovies({ htmlContainer: $containerMovies, movies: call.data.Search });
}

$logoutButton.addEventListener("click", () => {
  logout();
});
