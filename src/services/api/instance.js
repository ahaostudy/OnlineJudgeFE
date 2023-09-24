import axios from 'axios';
import { useAuthStore } from '../../store/auth';

const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
});


instance.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        config.headers.Authorization = "Bearer " + authStore.token;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default instance;
