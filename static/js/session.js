function useSession() {
  (function autoRedirect() {
    const validLogin = Boolean(window.sessionStorage.getItem("session"));
    if (validLogin) {
    } else {
      document.location.href = "login.html";
    }
  })();
}

function login({ username, password }) {
  const id = "_" + Math.random().toString(36).substr(2, 9);
  /* users in localStorage? */
  if (Boolean(window.localStorage.getItem("users"))) {
    let existUser = false;
    const users = JSON.parse(window.localStorage.getItem("users"));
    /* find user logged in users localStorage */
    users.map(user => {
      /* if find user is true, init session */
      if (user.username === username && user.password === password) {
        existUser = true;
        window.sessionStorage.setItem("session", JSON.stringify(user));
      }
    });
    /* if not find user, add to localStorage and init session */
    if (!existUser) {
      users.push({
        id,
        username,
        password,
        favorites: [],
        lastSearch: ""
      });
      window.sessionStorage.setItem(
        "session",
        JSON.stringify({
          id,
          username,
          password,
          favorites: [],
          lastSearch: ""
        })
      );
      window.localStorage.setItem("users", JSON.stringify(users));
    }
  } else {
    window.sessionStorage.setItem(
      "session",
      JSON.stringify({
        id,
        username,
        password,
        favorites: [],
        lastSearch: ""
      })
    );
    window.localStorage.setItem(
      "users",
      JSON.stringify([
        {
          id,
          username,
          password,
          favorites: [],
          lastSearch: ""
        }
      ])
    );
  }
  document.location.href = window.location.href.replace("/login.html", "/");
}

function logout() {
  window.sessionStorage.removeItem("session");
  document.location.href = "login.html";
}

function getUsers() {
  return JSON.parse(window.localStorage.getItem("users"));
}

function getSession() {
  return JSON.parse(window.sessionStorage.getItem("session"));
}

function getFavorites() {
  const session = JSON.parse(window.sessionStorage.getItem("session"));
  return session.favorites;
}

function getLastSearch() {
  const session = JSON.parse(window.sessionStorage.getItem("session"));
  return session.lastSearch;
}

function setLastSearch(keyword) {
  const session = JSON.parse(window.sessionStorage.getItem("session"));
  session.lastSearch = keyword.replace("+", " ");
  window.sessionStorage.setItem("session", JSON.stringify(session));
}

function checkFavStorage(id) {
  const session = getSession();
  return session.favorites.some(favorite => favorite.imdbID === id);
}

function toggleFavStorage(movie) {
  /* This function is ready for production? I do not know 🤔 */
  const session = getSession();
  let users = getUsers();
  let newFavorites = [];
  if (checkFavStorage(movie.imdbID)) {
    newFavorites = session.favorites.filter(fav => fav.imdbID !== movie.imdbID);
  } else {
    newFavorites = session.favorites;
    newFavorites.push(movie);
  }
  users = users.filter(user => user.id !== session.id);
  users.push({
    id: session.id,
    username: session.username,
    password: session.password,
    favorites: newFavorites
  });
  window.localStorage.setItem("users", JSON.stringify(users));
  window.sessionStorage.setItem(
    "session",
    JSON.stringify({ ...session, favorites: newFavorites })
  );
}

export {
  useSession,
  login,
  logout,
  checkFavStorage,
  toggleFavStorage,
  setLastSearch,
  getLastSearch,
  getFavorites
};
