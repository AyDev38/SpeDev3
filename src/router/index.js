// src\router\index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ProjectPage from '../views/ProjectPage.vue';
import NotFoundPage from '../views/NotFoundPage.vue';
import ProjectDetailPage from '@/views/ProjectDetailPage.vue';

const routes = [
  { path: '/', component: HomePage, meta: { requiresGuest: true } },
  { path: '/login', component: LoginPage, meta: { requiresGuest: true } },
  { path: '/register', component: RegisterPage, meta: { requiresGuest: true } },
  { path: '/projects', component: ProjectPage, meta: { requiresAuth: true } },
  { path: '/projects/:id', component: ProjectDetailPage, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name:"NotFound", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global pour la navigation
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Si la route nécessite que l'utilisateur soit non connecté
  if (to.meta.requiresGuest && authStore.currentUser) {
    next('/projects'); // Rediriger les utilisateurs connectés vers la page des projets
  }
  // Si la route nécessite que l'utilisateur soit connecté
  else if (to.meta.requiresAuth && !authStore.currentUser) {
    next('/login'); // Rediriger les utilisateurs non connectés vers la page de connexion
  }
  // Sinon, on continue la navigation
  else {
    next();
  }
});

export default router;
