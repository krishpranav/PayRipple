import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
            SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        }
        return Promise.reject(error);
    }
);

export default api;