import { ErrorsApi } from "./errors";
const API_KEY = "f62558de";
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`;

async function callApi(endpoint) {
  const options = {
    "Content-Type": "application/json",
    method: "GET"
  };
  let url;

  if (!endpoint.includes(BASE_URL)) {
    url = BASE_URL + endpoint;
  } else url = endpoint;

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = new ErrorsApi(response.status, data);
    throw error;
  }

  const data = await response.json();

  return { response: response, data: data };
}

export default callApi;
