import axios from 'axios';
import { getURL } from './getURL';

let url: string;

// Initialize the URL
const initializeURL = async () => {
  url = await getURL();
};
initializeURL();

// Get all recipes
export const getRecipes = async (status?: string) => {
  try {
    const query = status ? `?status=${status}` : '';
    const res = await axios.get(`${url}/api/v1/recipes/get${query}`);
    return res.data.res;
  } catch (err) {
    throw new Error(`Failed to get recipes: ${err}`);
  }
};

// get single recipe by id
export const getRecipeById = async (id: string) => {
  try {
    const res = await axios.get(`${url}/api/v1/recipes/get/${id}`);
    return res.data.res;
  } catch (err) {
    throw new Error(`Failed to get recipe by id: ${err}`);
  }
};

// Get all users by "","pending","published"
export const getUsers = async () => {
  try {
    const res = await axios.get(`${url}/api/v1/users/get`);
    return res.data.res;
  } catch (err) {
    throw new Error(`Failed to get recipes: ${err}`);
  }
};

// delete user
export const deleteUser = async (userId: string) => {
  const res = await axios.delete(`${url}/api/v1/users/delete/${userId}`);
  return res;
};

// update user role
export const updateUserRole = async (userId: string, newRole: string) => {
  const data = { userId, newRole };
  const res = await axios.post(`${url}/api/v1/users/update`, data);
  return res;
};

// publish recipe
export const publishRecipe = async (recipeId: string) => {
  const res = await axios.post(`${url}/api/v1/recipes/publish`, { recipeId });
  return res;
};

// decline recipe
export const deleteRecipe = async (recipeId: string) => {
  const res = await axios.post(`${url}/api/v1/recipes/delete`, { recipeId });
  return res;
};

//get stats
export const getStats = async () => {
  try {
    const res = await axios.get(`${url}/api/v1/stats`);
    return res.data.stats;
  } catch (err) {
    throw new Error(`Failed to get stats: ${err}`);
  }
};
