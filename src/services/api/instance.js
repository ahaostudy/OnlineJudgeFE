import axios from 'axios';
import { useAuthStore } from '../../store/auth';
import router from '../../router';
import { Message } from '@arco-design/web-vue';

const authStore = useAuthStore();

const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
});


instance.interceptors.request.use(
    (config) => {
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
