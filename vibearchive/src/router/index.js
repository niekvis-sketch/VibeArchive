import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import HomeView from '../views/HomeView.vue'

// Basic guard to check authentication
const requireAuth = (to, from, next) => {
  const user = auth.currentUser
  if (!user) {
    next('/login')
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/SignupView.vue')
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/projects/:id/edit',
      name: 'project-edit',
      component: () => import('../views/AddProjectView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/projects/new',
      name: 'project-create',
      component: () => import('../views/AddProjectView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      beforeEnter: requireAuth
    }
  ]
})

export default router
