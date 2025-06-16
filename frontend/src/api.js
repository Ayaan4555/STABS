import axios from "axios";

const API = axios.create({
  baseURL: "https://stabs-backend.onrender.com/api",
});

export default API;
