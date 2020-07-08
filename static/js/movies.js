function useMovies({ htmlContainer = null, movies = [] }) {
  if (htmlContainer.hasChildNodes()) {
    htmlContainer.innerHTML = "";
  }

  movies.map(movie => {
    const htmlItem = newMovieItem(movie);
    htmlContainer.insertAdjacentHTML("beforeend", htmlItem);
  });

  function newMovieItem({ Title, Poster, Type, Year, imdbID }) {
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
      const movieSelected = movies.find(
        movie => movie.imdbID === element.getAttribute("id")
      );
      const $ligthBox = document.getElementById("lightbox");
      // const htmlContent = newMovieItem(movieSelected);
      // $ligthBox.insertAdjacentHTML("beforeend", htmlContent);
      $ligthBox.classList.toggle("u-is-hidden");
    })
  );

  document.getElementById("button-lightbox").addEventListener("click", () => {
    const $ligthBox = document.getElementById("lightbox");
    $ligthBox.classList.toggle("u-is-hidden");
  });
}

export { useMovies };
