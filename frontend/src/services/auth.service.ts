import axios from "axios";

const API_URL = 'http://localhost:3001/api';

export const register = (email: string, password: string) => {
  return axios.post(API_URL + '/v1/users', {
    email,
    password,
  });
};

export const login = (email: string, password: string) => {
  return axios
    .post(API_URL + '/v1/users/login', {
      email,
      password,
    })
    .then((response) => {
      localStorage.setItem('name',JSON.stringify(response))
      if (response.data.access_token) { 
        localStorage.setItem(
          'user',
          JSON.stringify(response.data.access_token)
        );
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
