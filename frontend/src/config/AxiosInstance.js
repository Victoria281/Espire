import axios from 'axios';

import AuthService from './AuthService';
import getConfiguration from './config';

const axiosInstance = axios.create(getConfiguration());

axiosInstance.interceptors.request.use(
    async config => {
        const token = AuthService.getToken();
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
        const originalRequest = err.config;
        console.log('originalRequest', originalRequest)
        // if (err?.response.status === 403) {
        //     AuthService.redirectToLogout();
        // }
        if (err?.response.status === 401 && originalRequest._retry) {
            AuthService.updateToken((refreshed) => {
                if (refreshed) {
                    console.log('refreshed ' + new Date());
                    originalRequest._retry = true;
                    Promise.resolve(axiosInstance(originalRequest));
                } else {
                    console.log('not refreshed ' + new Date());
                    // AuthService.redirectToLogin();
                }
            }).error(() => {
                console.error('Failed to update token ' + new Date());
                // AuthService.redirectToLogin();
            });
        }
        return Promise.reject(err);
    }
);

export default axiosInstance;