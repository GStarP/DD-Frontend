import axios from "axios";

const globalAxios = axios.create({
  baseURL: "http://127.0.0.1:8080",
  timeout: 5 * 1000
});

export default globalAxios;
