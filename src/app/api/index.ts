import axios from 'axios';

const API_SERVER_URL = 'https://disk-flow-snow-elements.trycloudflare.com'; 

function createApi(headers: Record<string, string>) {
  const instance = axios.create({
    baseURL: API_SERVER_URL,
    headers,
  });

  return instance;
}

export const api = createApi({
  'Content-Type': 'application/json',
});
