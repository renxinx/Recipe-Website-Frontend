import axios from "axios";

class SavedDataService  {

  getAll(id) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes/saved/${id}`);
  }

  updatesaved(data) {
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes/saved`, data);
  }
}

export default new SavedDataService();