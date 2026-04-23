import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Result from '../views/Result.vue'
import AdminLogin from '../views/admin/Login.vue'
import AdminRegister from '../views/admin/Register.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminEdit from '../views/admin/Edit.vue'
import AdminAdd from '../views/admin/Add.vue'
import AdminImport from '../views/admin/Import.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/register',
    name: 'AdminRegister',
    component: AdminRegister
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/admin/edit',
    name: 'AdminEdit',
    component: AdminEdit
  },
  {
    path: '/admin/tambah',
    name: 'AdminAdd',
    component: AdminAdd
  },
  {
    path: '/admin/import',
    name: 'AdminImport',
    component: AdminImport
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin') && to.path !== '/admin/login' && to.path !== '/admin/register') {
    if (localStorage.getItem('isAdmin') === 'true') {
      next()
    } else {
      next('/admin/login')
    }
  } else {
    next()
  }
})

export default router
