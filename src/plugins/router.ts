import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/sign-in',
    component: () => import('@/pages/SignIn.vue')
  },
  {
    path: '/sign-up',
    component: () => import('@/pages/SignUp.vue')
  },
  {
    path: '/about',
    component: () => import('@/pages/About.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
