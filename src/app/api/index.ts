import axios from 'axios';

//const API_SERVER_URL = 'http://localhost:8080';
const API_SERVER_URL = 'http://112.186.86.251:8080';

function createApi(headers: Record<string, string>) {
  const instance = axios.create({
    baseURL: API_SERVER_URL,
    headers,
    withCredentials: true,
  });

  return instance;
}

export const api = createApi({
  'Content-Type': 'application/json',
});
