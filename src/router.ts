import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from './store'
import { message } from 'ant-design-vue';

const routes = [
  { path: '/profile', component: () => import('./pages/profile/index.vue') },
  // { path: '/profile/edit', component: () => import('./pages/profile/Edit.vue') },
  // { path: '/profile/edit-company', component: () => import('./pages/profile/EditCompany.vue') },
  { path: '/application', component: () => import('./pages/application/ApplicationForm.vue') },
  { path: '/statistic', component: () => import('./pages/statistic/index.vue') },
  { path: '/statistic-v2', component: () => import('./pages/statistic/v2.vue') },
  { path: '/statistic-v3', component: () => import('./pages/statistic/v3.vue') },
  { path: '/statistic-v4', component: () => import('./pages/statistic/v4.vue') }, 
  { path: '/statistic-v5', component: () => import('./pages/statistic/v5.vue') },
  { path: '/voting', component: () => import('./pages/voting/republic.vue') },
  { path: '/voting/:id', component: () => import('./pages/voting/View.vue') },
  { path: '/', component: () => import('./pages/main/index.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  // voting, profile
  if ((to.path.includes('voting') || to.path.includes('profile')) && !store.user) {
    message.error('Нужно авторизоваться');
    next('/');
  }
  next();
});


export default router;
