// src/utils/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/", // Django backend address
});

export default api;
