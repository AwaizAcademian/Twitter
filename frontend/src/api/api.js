import axios from "axios";
import { configs } from "eslint-plugin-react-refresh";

const API = axios.create({ baseURL : 'http://localhost:3000/api'});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default API;