import axios from "axios";

class RecipeDataService  {

  getAll(page = 0) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes?page=${page}`);
  }

  find(query, by="title", page=0) {
    return axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes?${by}=${query}&page=${page}`
    );
  }

  getRecipe(id){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes/id/${id}`);
  }

  getMeal(){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes/meal`)
  }

  getDifficulty(){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes/difficulty`)
  }

  getDietary(){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes/dietary`)
  }

  createRecipe(data) {
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes`, data);
  }
  updateContent(data){
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes`, data);
  }

  deleteRecipe(data) {
    return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes`, { data });
  }

  getsavedRecipes(saved) {
    let savedIds = JSON.stringify(saved);
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/recipes/ids/${savedIds}`);
  }
}

export default new RecipeDataService();