import { createRouter, createWebHistory } from 'vue-router'
const Index = () => import('../views/Index.vue')
const Login = () => import('../views/Login.vue')
const Problems = () => import('../views/Problems.vue')
const Problem = () => import('../views/Problem.vue')

const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/problems',
        component: Problems
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/problem/:id',
        component: Problem
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
