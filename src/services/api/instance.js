import axios from 'axios';
import router from '../../router';
import { Message } from '@arco-design/web-vue';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_API_URI,
    timeout: 5000,
});

instance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if (!token) token = '';

        config.headers.Authorization = "Bearer " + token;
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
        if (!error.response) {
            return Promise.reject(error);
        }
        if (error.response.status === 401) {
            Message.error('请先登录账号');
            router.push('/login');
        }
        if (error.response.status === 403) {
            Message.error('无操作权限');
        }
        return Promise.reject(error);
    },
);

export default instance;
