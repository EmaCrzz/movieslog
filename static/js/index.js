import { movie } from "./services/search.js";

const $inputSearch = document.getElementById("input-search");
const $formSearch = document.getElementById("form-search");

$formSearch.addEventListener("submit", e => {
  e.preventDefault();
  searchMovie();
});

async function searchMovie() {
  const param = $inputSearch.value.replace(" ", "+");
  const call = await movie.searchByTitle(`t=${param}`);
}
