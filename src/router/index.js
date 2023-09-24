import { createRouter, createWebHistory } from 'vue-router'
const Index = () => import('../views/Index.vue')
const Login = () => import('../views/Login.vue')

const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
