import { createRouter, createWebHistory } from 'vue-router'
const Index = () => import('../views/Index.vue')
const Login = () => import('../views/Login.vue')
const Problems = () => import('../views/Problems.vue')
const Problem = () => import('../views/Problem.vue')
const ProblemPreview = () => import('../views/ProblemPreview.vue')
const AdminTestcase = () => import('../views/AdminTestcase.vue')
const Notes = () => import('../views/Notes.vue')
const Note = () => import('../views/Note.vue')

const routes = [
    {
        path: '/',
        component: Problems,
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
    },
    {
        path: '/problem/preview/:id',
        component: ProblemPreview
    },
    {
        path: '/admin/testcase',
        component: AdminTestcase
    },
    {
        path: '/notes',
        component: Notes
    },
    {
        path: '/note/:id',
        component: Note
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
