import { movies } from "./services/search.js";
import {
  checkFavStorage,
  toggleFavStorage,
  getLastSearch,
  setLastSearch
} from "./session.js";

async function useMovies({
  htmlContainer = null,
  htmlLoader = null,
  htmlError = null,
  keyword = null
}) {
  let listMovies = [];

  if (!keyword) {
    const lastKeyword = getLastSearch();
    if (lastKeyword) {
      toggleLoader(htmlLoader);
      const htmlLastSearch = `<p id="last-search" class="u-wrapper">Last search: ${lastKeyword}</p>`;
      htmlContainer.insertAdjacentHTML("beforebegin", htmlLastSearch);
      const call = await movies.searchByTitle(`s=${lastKeyword}`);
      if ("Error" in call.data) {
        htmlError.classList.toggle("u-is-hidden");
        htmlError.textContent = call.data.Error;
        toggleLoader(htmlLoader);
        return;
      }
      listMovies = call.data.Search;
    } else {
      const htmlEmpty = getMoviesEmpty();
      htmlContainer.insertAdjacentHTML("beforeend", htmlEmpty);
      return;
    }
  } else {
    toggleLoader(htmlLoader);
    if (htmlContainer.hasChildNodes()) {
      htmlContainer.innerHTML = "";
    }
    const call = await movies.searchByTitle(`s=${keyword}`);
    if ("Error" in call.data) {
      htmlError.classList.toggle("u-is-hidden");
      htmlError.textContent = call.data.Error;
      toggleLoader(htmlLoader);
      return;
    }
    const $lastSearch = document.getElementById("last-search");
    if ($lastSearch) $lastSearch.remove();
    listMovies = call.data.Search;
    setLastSearch(keyword);
  }

  listMovies.map(movie => {
    const htmlItem = createMovieItem(movie);
    htmlContainer.insertAdjacentHTML("beforeend", htmlItem);
  });
  toggleLoader(htmlLoader);

  function getMoviesEmpty() {
    return `<p>Search a movies</p>`;
  }

  function createMovieItem({ Title, Poster, Type, Year, imdbID }) {
    return `<div class="masonry-item" id=${imdbID}>
      <img
        src=${Poster}
        alt="Poster-${Title}"
        title="${Title}"
      />
      <h5>${Title}</h5>
      <small>${Type} - ${Year}</small>
    </div>`;
  }

  document.querySelectorAll(".masonry-item").forEach(element =>
    element.addEventListener("click", () => {
      const movieSelected = listMovies.find(
        movie => movie.imdbID === element.getAttribute("id")
      );
      const $ligthBox = document.getElementById("lightbox");
      $ligthBox.innerHTML = "";
      const htmlContent = showDetail(movieSelected);
      $ligthBox.insertAdjacentHTML("beforeend", htmlContent);
      $ligthBox.classList.add("lightbox--show");
      listenerHideDetail();
      listenerFavButton(movieSelected.imdbID);
      searchDetailsMovie(movieSelected.imdbID);
    })
  );

  function showDetail({ Title, Poster, Type, Year, imdbID }) {
    const fav = checkFavStorage(imdbID);
    return `<div class="u-wrapper-md">
      <button
        id="button-lightbox"
        class="u-button outlined border-none button_lightbox"
      >
        <img src="./static/icons/cerrar.svg" alt="" />
      </button>
      <div class="container_lightbox">
        <div class="lightbox_details">
          <img class="lightbox_poster" src="${Poster}" alt="" />
          <div class="lightbox_info">
            <h2 class="u-h4 u-text-center">${Title}</h2>
            <hr />
            <h4 class="u-h6" class="u-text-center">${Type} - ${Year}</h4>
            <h4 class="u-h6" id="country"></h4>
            <h4 class="u-h6" id="genre"></h4>
            <h4 class="u-h6" id="language"></h4>
            <h4 class="u-h6" id="production"></h4>
            <p class="u-h6" id="actors"></p>
          </div>
        </div>
        <div id="loader-details" class="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div id="footer" class="u-is-hidden">
          <small id="plot" class="u-p"></small>
          <button
            id="button-fav"
            class="u-button border-none large outlined large"
            title="${!fav ? "add to favorites" : "remove from favorites"}"
          >
            <i class="fa fa-heart${!fav ? "-o" : ""} " aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>`;
  }

  function listenerHideDetail() {
    document.getElementById("button-lightbox").addEventListener("click", () => {
      const $ligthBox = document.getElementById("lightbox");
      $ligthBox.classList.remove("lightbox--show");
    });
  }

  function listenerFavButton(id) {
    document.getElementById("button-fav").addEventListener("click", e => {
      e.currentTarget.firstElementChild.classList.toggle("fa-heart-o");
      e.currentTarget.firstElementChild.classList.toggle("fa-heart");
      toggleFavStorage(id);
    });
  }

  async function searchDetailsMovie(id) {
    const $loader = document.getElementById("loader-details");
    const $footer = document.getElementById("footer");
    const $country = document.getElementById("country");
    const $genre = document.getElementById("genre");
    const $language = document.getElementById("language");
    const $production = document.getElementById("production");
    const $actors = document.getElementById("actors");
    const $plot = document.getElementById("plot");

    const call = await movies.searchById(`&i=${id}`);

    $loader.classList.toggle("loader");
    $footer.classList.toggle("u-is-hidden");
    $footer.classList.toggle("footer_detail");

    $country.textContent = `Country: ${call.data.Country}`;
    $genre.textContent = `Genre: ${call.data.Genre}`;
    $language.textContent = `Language: ${call.data.Language}`;
    $production.textContent = `Production: ${call.data.Production}`;
    $actors.textContent = `Actors: ${call.data.Actors}`;
    $plot.textContent = call.data.Plot;
  }

  function toggleLoader(loader) {
    loader.classList.toggle("loader");
  }
}

export { useMovies };
