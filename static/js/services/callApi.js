const API_KEY = "f62558de";
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;

async function callApi(param) {
  const options = {
    "Content-Type": "application/json",
    method: "GET"
  };
  const url = BASE_URL + param;

  const response = await fetch(url, options);
  const data = await response.json();

  return { response: response, data: data };
}

export default callApi;
