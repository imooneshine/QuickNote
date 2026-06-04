import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this when deploying
  withCredentials: true, // Always send cookies
});

export default api;