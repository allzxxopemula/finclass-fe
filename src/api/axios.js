import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiRoot = configuredApiUrl || (import.meta.env.DEV
  ? 'http://192.168.1.11:8000/api'
  : '/api');
const normalizedApiRoot = apiRoot.replace(/\/+$/, '');
const baseURL = normalizedApiRoot.endsWith('/api')
  ? normalizedApiRoot
  : `${normalizedApiRoot}/api`;

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default API;