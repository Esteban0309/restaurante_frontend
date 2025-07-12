// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://restaurante-api.desarrollo-software.xyz',
});

export default api;
