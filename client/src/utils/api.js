import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important: allow cookies to be sent
});

export default API;
