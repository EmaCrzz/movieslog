import callApi from "./callApi.js";

const movies = {
  searchById(id) {
    return callApi(id);
  },
  searchByTitle(title) {
    return callApi(title);
  }
};

export { movies };
