function isLoggedIn() {
  return Boolean(window.localStorage.getItem("token"));
}

function useSession() {
  (function autoRedirect() {
    const validLogin = isLoggedIn();
    if (validLogin) {
      console.log("esta loggeado");
    } else {
      document.location.href = "login.html";
      console.log("no esta loggeado");
    }
  })();
}

export { useSession };
