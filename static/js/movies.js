function useMovies({ htmlContainer = null, movies = [] }) {
  console.log(movies);
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
}

export { useMovies };
