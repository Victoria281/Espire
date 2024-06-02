import axios from 'axios';
import { useSelector } from "react-redux";

import getConfiguration from './config';

const axiosInstance = axios.create({
    timeout: getConfiguration().timeout,
    headers: {},
    baseURL: getConfiguration().baseURL,
});

function redirectToLogin() {
    //handle login
}

function redirectToLogout() {
    //handle logout
}

axiosInstance.interceptors.request.use(
    async config => {
        // const token = useSelector(state => state.user.token)
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTc0MTQzMTEsInVzZXJuYW1lIjoidGVzdCJ9.kQ_O_VKL8h1a5mFr-1AgsgQNPEdrjGvZFhVCV8zYB_8"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

axiosInstance.interceptors.response.use(
    response =>
        Promise.resolve(response),
    async err => {
        // console.log(err)
        const originalRequest = err.config;
        // console.log('originalRequest', originalRequest)
        if (err?.response.status === 403) {
            redirectToLogout();
        }
        if (err?.response.status === 401 && originalRequest._retry) {
            console.log("Token have expired!")
            redirectToLogin();
        }
        return Promise.reject(err);
    }
);

export default axiosInstance;