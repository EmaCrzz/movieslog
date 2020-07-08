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
  if (Boolean(window.localStorage.getItem("users"))) {
    let existUser = false;
    const users = JSON.parse(window.localStorage.getItem("users"));
    users.map(
      ({
        id,
        username: usernameStorage,
        password: passwordStorage,
        favorites
      }) => {
        if (usernameStorage === username && passwordStorage === password) {
          existUser = true;
          window.sessionStorage.setItem(
            "session",
            JSON.stringify({ id, username, password, favorites })
          );
        }
      }
    );
    if (!existUser) {
      const id = "_" + Math.random().toString(36).substr(2, 9);
      users.push({ id, username, password, favorites: [] });
      window.sessionStorage.setItem(
        "session",
        JSON.stringify({ id, username, password, favorites: [] })
      );
      window.localStorage.setItem("users", JSON.stringify(users));
    }
  } else {
    const id = "_" + Math.random().toString(36).substr(2, 9);
    window.sessionStorage.setItem(
      "session",
      JSON.stringify({
        id,
        username,
        password,
        favorites: []
      })
    );
    window.localStorage.setItem(
      "users",
      JSON.stringify([{ id, username, password, favorites: [] }])
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

function checkFavStorage(id) {
  const session = getSession();
  return session.favorites.some(favorite => favorite === id);
}

function toggleFavStorage(id) {
  const session = getSession();
  let users = getUsers();
  let newFavorites = [];
  if (checkFavStorage(id)) {
    newFavorites = session.favorites.filter(fav => fav !== id);
  } else {
    newFavorites = session.favorites;
    newFavorites.push(id);
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
    JSON.stringify({
      id: session.id,
      username: session.username,
      password: session.password,
      favorites: newFavorites
    })
  );
}

export { useSession, login, logout, checkFavStorage, toggleFavStorage };
