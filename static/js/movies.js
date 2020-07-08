import { movies } from "./services/search.js";

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
      searchDetailsMovie(movieSelected.imdbID);
    })
  );

  function showDetail({ Title, Poster, Type, Year, imdbID }) {
    return `<div class="u-wrapper-sm">
      <button
        id="button-lightbox"
        class="u-button with-icon is-outlined button_lightbox"
      >
        <img src="./static/icons/cerrar.svg" alt="" />
      </button>
      <div class="container_lightbox">
        <img class="lightbox_poster" src="${Poster}" alt="" />
        <div class="lightbox_details">
          <h2>${Title}</h2>
          <p id="loading">loading...</p>
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

  async function searchDetailsMovie(id) {
    const $loading = document.getElementById("loading");
    const call = await movies.searchById(`i=${id}`);
    $loading.textContent = "";
    $loading.textContent = call.data.Plot;
    console.log(call);
  }
}

export { useMovies };
