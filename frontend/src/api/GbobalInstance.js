import axios from 'axios';

const mainUrl = "http://127.0.0.1:8000"
export const axiosAuth = axios.create({
    baseURL: mainUrl,
    timeout: 2500,
});

