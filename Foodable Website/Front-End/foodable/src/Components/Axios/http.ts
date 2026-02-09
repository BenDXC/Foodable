import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:8080/api";

export default axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json"
  },
  timeout: 10000,
});
