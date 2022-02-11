import { createRouter, createWebHashHistory } from 'vue-router';
import SignIn from '@/pages/SignIn.vue';
import SignUp from '@/pages/SignUp.vue';
import Home from '@/pages/Home.vue';
import NewFriend from '@/pages/NewFriend.vue';
import NewGroup from '@/pages/NewGroup.vue';
import Zone from '@/pages/Zone.vue';
import DiaLog from '@/pages/Dialog.vue';
import ProfileUser from '@/pages/ProfileUser.vue';
import ProfileGroup from '@/pages/ProfileGroup.vue';

const routes = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/sign-in',
    component: SignIn
  },
  {
    path: '/sign-up',
    component: SignUp
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        component: () => import('@/pages/About.vue')
      },
      {
        path: 'new-friend',
        component: NewFriend
      },
      {
        path: 'new-group',
        component: NewGroup
      },
      {
        path: 'zone',
        component: Zone
      },
      {
        path: 'dialog/:type/:id/:name',
        component: DiaLog
      },
      {
        path: 'profile/f/:id',
        component: ProfileUser
      },
      {
        path: 'profile/g/:id',
        component: ProfileGroup
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
