import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: {name: 'Publications'} },
      { path: 'publications', name: 'Publications', component: () => import('pages/Publications.vue') },
      { path: 'profile/:id', name: 'Profile', component: () => import('pages/Profile.vue'), props: true }
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: () => import('pages/Signup.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];


export default routes;
