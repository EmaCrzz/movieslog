import { movies } from "./services/search.js";
import {
  checkFavStorage,
  toggleFavStorage,
  getLastSearch,
  setLastSearch,
  getFavorites
} from "./session.js";
const posterSvg = "static/images/photo.svg";
async function useMovies({
  htmlContainer = null,
  htmlLoader = null,
  htmlError = null,
  keyword = null,
  favoritesPage = false
}) {
  let listMovies = [];
  const lastKeyword = getLastSearch();

  if (!lastKeyword && !keyword && !favoritesPage) {
    const htmlLastSearch = `<p id="p-info" class="u-wrapper">Search a movies</p>`;
    htmlContainer.insertAdjacentHTML("beforebegin", htmlLastSearch);
  }

  if (lastKeyword && !keyword && !favoritesPage) {
    toggleLoader(htmlLoader);
    const htmlLastSearch = `<p id="p-info" class="u-wrapper">Last search: ${lastKeyword}</p>`;
    htmlContainer.insertAdjacentHTML("beforebegin", htmlLastSearch);
    const call = await movies.searchByTitle(`s=${lastKeyword}`);
    listMovies = call.data.Search;
    showMovies();
    toggleLoader(htmlLoader);
  }

  if (favoritesPage) {
    listMovies = getFavorites();
    toggleLoader(htmlLoader);
    if (listMovies.length === 0) {
      createHtmlEmptyFavPage();
      return;
    }
    const htmlFavorites = `<p id="p-info" class="u-wrapper">Your Favorites</p>`;
    htmlContainer.insertAdjacentHTML("beforebegin", htmlFavorites);
    showMovies();
  }

  if (keyword) {
    const $pInfoHTML = document.getElementById("p-info");
    toggleLoader(htmlLoader);
    if ($pInfoHTML) $pInfoHTML.remove();
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
    listMovies = call.data.Search;
    setLastSearch(keyword);
    showMovies();
    toggleLoader(htmlLoader);
  }

  function showMovies() {
    listMovies.map(movie => {
      const htmlItem = createMovieItem(movie);
      htmlContainer.insertAdjacentHTML("beforeend", htmlItem);
    });
    addListenerMovieItem();
  }

  function createMovieItem({ Title, Poster, Type, Year, imdbID }) {
    const srcPoster = Poster !== "N/A" ? Poster : posterSvg;
    return `<div class="masonry-item" id=${imdbID}>
      <img
        src="${srcPoster}"
        alt="Poster-${Title}"
        title="${Title}"
      />
      <h5>${Title}</h5>
      <small>${Type} - ${Year}</small>
    </div>`;
  }

  function addListenerMovieItem() {
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
  }

  function showDetail({ Title, Poster, Type, Year, imdbID }) {
    const fav = checkFavStorage(imdbID);
    const img =
      Poster !== "N/A"
        ? `<img class="card_movie_poster" src="${Poster}" alt="" />`
        : "";
    return `<div class="u-wrapper-md">
      <button
        id="button-lightbox"
        class="button_lightbox u-button outlined border-none"
      >
        <img src="./static/icons/cerrar.svg" alt="" />
      </button>
      <div class="container_lightbox">
        <h2 class="u-h4 card_movie_title">${Title}</h2>
        <hr />
        <div class="card_movie_header">
          ${img}
          <div>
            <h4 class="u-h6">${Type} - ${Year}</h4>
            <h4 class="u-h6" id="country"></h4>
            <h4 class="u-h6" id="genre"></h4>
            <h4 class="u-h6" id="language"></h4>
            <h4 class="u-h6" id="production"></h4>
          </div>
        </div>
        <div id="loader-details" class="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div id="footer" class="u-is-hidden">
          <p class="u-h6" id="actors"></p>
          <small id="plot" class="u-p"></small>
          <button
            id="button-fav"
            class="u-button border-none large outlined"
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
      const movieClicked = listMovies.find(mov => mov.imdbID === id);
      e.currentTarget.firstElementChild.classList.toggle("fa-heart-o");
      e.currentTarget.firstElementChild.classList.toggle("fa-heart");
      toggleFavStorage(movieClicked);
      if (favoritesPage) {
        document.getElementById(id).remove();
        const $ligthBox = document.getElementById("lightbox");
        $ligthBox.classList.remove("lightbox--show");
        checkEmptyFavPage();
      }
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
    $plot.textContent = call.data.Plot !== "N/A" ? call.data.Plot : "";
  }

  function createHtmlEmptyFavPage() {
    const htmlFavoritesEmpty = `<div id="p-info" class="movies_favorites_empty">
        <span>You have no favorites. <a href="index.html">Add&nbsp;your&nbsp;search</a></span>
      </div>`;
    htmlContainer.insertAdjacentHTML("beforebegin", htmlFavoritesEmpty);
  }

  function checkEmptyFavPage() {
    if (!htmlContainer.hasChildNodes()) {
      const $pInfoHTML = document.getElementById("p-info");
      if ($pInfoHTML) $pInfoHTML.remove();
      createHtmlEmptyFavPage();
    }
  }

  function toggleLoader(loader) {
    loader.classList.toggle("loader");
  }
}

export { useMovies };
