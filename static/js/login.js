function validateForm(event) {
  event.preventDefault();
  let validForm = true;
  const $errorUsername = document.getElementById("error-username");
  const $errorPassword = document.getElementById("error-password");

  $errorUsername.classList.remove("input_control_error");
  $errorPassword.classList.remove("input_control_error");

  const $username = document.getElementById("username");
  const $password = document.getElementById("password");

  if (!$username.value) {
    $errorUsername.classList.add("input_control_error");
    validForm = false;
  }

  if (!$password.value) {
    $errorPassword.classList.add("input_control_error");
    validForm = false;
  }

  if (validForm) {
    window.localStorage.setItem("token", "true");
    document.location.href = "/index.html";
  }
}

const formLogin = document.getElementById("form-login");
formLogin.addEventListener("submit", validateForm, false);
