const btnSwitch = document.querySelector("#switch");

if (btnSwitch) {
  btnSwitch.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    btnSwitch.classList.toggle("active");
    if (Boolean(window.localStorage.getItem("dark-mode"))) {
      window.localStorage.removeItem("dark-mode");
    } else {
      window.localStorage.setItem("dark-mode", "true");
    }
  });
}

if (Boolean(window.localStorage.getItem("dark-mode"))) {
  document.body.classList.toggle("dark");
  if (btnSwitch) {
    btnSwitch.classList.toggle("active");
  }
}
