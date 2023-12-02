import { createRouter, createWebHistory } from 'vue-router'
const Index = () => import('../views/Index.vue')
const Login = () => import('../views/Login.vue')
const NotFound = () => import('../views/NotFound.vue')
const Problems = () => import('../views/problem/Problems.vue')
const Problem = () => import('../views/problem/Problem.vue')
const ProblemPreview = () => import('../views/problem/ProblemPreview.vue')
const AdminTestcase = () => import('../views/admin/AdminTestcase.vue')
const Notes = () => import('../views/note/Notes.vue')
const Note = () => import('../views/note/Note.vue')
const NoteEditor = () => import('../views/note/NoteEditor.vue')
const Profile = () => import('../views/user/Profile.vue')
const Submit = () => import('../views/submit/Submit.vue')
const Chat = () => import('../views/chat/Chat.vue')

const routes = [
  {
    path: '/',
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
    path: '/problem/:id/:tab',
    component: Problem
  },
  {
    path: '/problem/preview/:id',
    component: ProblemPreview
  },
  {
    path: '/problems',
    component: Problems
  },
  {
    path: '/submit/:id',
    component: Submit
  },
  {
    path: '/notes',
    component: Notes
  },
  {
    path: '/note/editor',
    component: NoteEditor
  },
  {
    path: '/note/editor/:id',
    component: NoteEditor
  },
  {
    path: '/note/:id',
    component: Note
  },
  {
    path: '/profile/:username',
    component: Profile
  },
  {
    path: '/admin/testcase',
    component: AdminTestcase
  },
  {
    path: '/chat',
    component: Chat
  },
  {
    path: '/:pathMatch(.*)',
    component: NotFound
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
