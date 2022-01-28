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
    path: '/home',
    component: () => import('@/pages/Home.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/About.vue')
      },
      {
        path: 'new-friend',
        component: () => import('@/pages/NewFriend.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
