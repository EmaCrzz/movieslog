import { login } from "./session.js";

function validateForm(event) {
  event.preventDefault();
  let validForm = true;
  const $errorUsername = document.getElementById("error-username");
  const $errorPassword = document.getElementById("error-password");

  $errorUsername.classList.remove("text_field_error");
  $errorPassword.classList.remove("text_field_error");

  const $username = document.getElementById("username");
  const $password = document.getElementById("password");

  if (!$username.value) {
    $errorUsername.classList.remove("u-is-hidden");
    $errorUsername.classList.add("text_field_error");
    validForm = false;
  }

  if (!$password.value) {
    $errorPassword.classList.remove("u-is-hidden");
    $errorPassword.classList.add("text_field_error");
    validForm = false;
  }

  if (validForm) {
    login({ username: $username.value, password: $password.value });
  }
}

const formLogin = document.getElementById("form-login");
formLogin.addEventListener("submit", validateForm, false);
