import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Resume from './components/Resume.vue'
import Interview from './components/Interview.vue'
import History from './components/history.vue'
import Home from './components/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            requiresAuth: true,
            title: '首頁',
            icon: 'Home'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            requiresAuth: false,
            title: '登入',
            icon: 'Login'
        }
    },
    {
        path: '/resume',
        name: 'Resume',
        component: Resume,
        meta: {
            requiresAuth: true,
            title: '履歷管理',
            icon: 'FileText'
        }
    },
    {
        path: '/interview',
        name: 'Interview',
        component: Interview,
        meta: {
            requiresAuth: true,
            title: '面試練習',
            icon: 'User'
        }
    },
    {
        path: '/history',
        name: 'History',
        component: History,
        meta: {
            requiresAuth: true,
            title: '歷史記錄',
            icon: 'History'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0 }
    }
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token')
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    // 設置頁面標題
    document.title = to.meta.title ? `${to.meta.title} - 面試助手` : '面試助手'
    
    if (requiresAuth && !token) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    } else if (to.path === '/login' && token) {
        next('/')
    } else {
        next()
    }
})

export default router