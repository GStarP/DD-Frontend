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
      },
      {
        path: 'new-group',
        component: () => import('@/pages/NewGroup.vue')
      },
      {
        path: 'zone',
        component: () => import('@/pages/Zone.vue')
      },
      {
        path: 'dialog/:type/:id',
        component: () => import('@/pages/Dialog.vue')
      },
      {
        path: 'profile/f/:id',
        component: () => import('@/pages/ProfileUser.vue')
      },
      {
        path: 'profile/g/:id',
        component: () => import('@/pages/ProfileGroup.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
