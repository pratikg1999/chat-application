import axios from "axios";
const axiosInstance = axios.create({
  baseURL: !process.env.REACT_APP_ENV
    ? "http://localhost:5000/api"
    : `${process.env.REACT_APP_ENV}/api`,
  withCredentials: true,
});

export default axiosInstance;
