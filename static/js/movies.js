import { movies } from "./services/search.js";
import { checkFavStorage, toggleFavStorage } from "./session.js";

function useMovies({ htmlContainer = null, listMovies = [] }) {
  if (htmlContainer.hasChildNodes()) {
    htmlContainer.innerHTML = "";
  }

  listMovies.map(movie => {
    const htmlItem = createMovieItem(movie);
    htmlContainer.insertAdjacentHTML("beforeend", htmlItem);
  });

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
      $ligthBox.classList.toggle("u-is-hidden");
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
        class="u-button with-icon is-outlined button_lightbox"
      >
        <img src="./static/icons/cerrar.svg" alt="" />
      </button>
      <div class="container_lightbox">
        <div class="lightbox_details">
          <img class="lightbox_poster" src="${Poster}" alt="" />
          <div class="lightbox_info">
            <h2 class="u-h4 u-text-center">${Title}</h2>
            <h4 class="u-h6" class="u-text-center">${Type} - ${Year}</h4>
            <h4 class="u-h6" id="country"></h4>
            <h4 class="u-h6" id="genre"></h4>
            <h4 class="u-h6" id="language"></h4>
            <h4 class="u-h6" id="production"></h4>
            <p class="u-h6" id="actors"></p>
          </div>
        </div>
        <div id="loader" class="a u-text-center" style="--n: 5">
          <div class="dot" style="--i: 0"></div>
          <div class="dot" style="--i: 1"></div>
          <div class="dot" style="--i: 2"></div>
          <div class="dot" style="--i: 3"></div>
          <div class="dot" style="--i: 4"></div>
        </div>
        <div id="footer" class="u-is-hidden">
          <small id="plot" class="u-p"></small>
          <button
            id="button-fav"
            class="u-button is-outlined is-large"
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
      $ligthBox.classList.toggle("u-is-hidden");
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
    const $loader = document.getElementById("loader");
    const $footer = document.getElementById("footer");
    const $country = document.getElementById("country");
    const $genre = document.getElementById("genre");
    const $language = document.getElementById("language");
    const $production = document.getElementById("production");
    const $actors = document.getElementById("actors");
    const $plot = document.getElementById("plot");

    const call = await movies.searchById(`&i=${id}`);

    $loader.classList.toggle("u-is-hidden");
    $footer.classList.toggle("u-is-hidden");
    $footer.classList.toggle("footer_detail");

    $country.textContent = `Country: ${call.data.Country}`;
    $genre.textContent = `Genre: ${call.data.Genre}`;
    $language.textContent = `Language: ${call.data.Language}`;
    $production.textContent = `Production: ${call.data.Production}`;
    $actors.textContent = `Actors: ${call.data.Actors}`;
    $plot.textContent = call.data.Plot;
  }
}

export { useMovies };
