import axios from 'axios';

const BASE_URL = '/api';

const globalAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 5 * 1000
});

export default globalAxios;
