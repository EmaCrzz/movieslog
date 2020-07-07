function isLoggedIn() {
  return Boolean(window.localStorage.getItem("token"));
}

function useSession() {
  (function autoRedirect() {
    const validLogin = isLoggedIn();
    if (validLogin) {
    } else {
      document.location.href = "login.html";
    }
  })();
}

function logout() {
  window.localStorage.removeItem("token");
  document.location.href = "login.html";
}

export { useSession, logout };
