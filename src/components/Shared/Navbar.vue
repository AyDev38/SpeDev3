<!-- src\components\Shared\Navbar.vue -->
<template>
  <nav class="navbar">
    <div>
      <router-link to="/">Accueil</router-link>
      <router-link v-if="authStore.currentUser" to="/projects">Projets</router-link>
    </div>
    <div>
      <button v-if="authStore.currentUser" @click="logout">Déconnexion</button>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout();
  router.push('/');
}
</script>

<style scoped>
/* Styles de la navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #333;
  color: white;
}

a, button {
  margin: 0 10px;
  color: white;
  text-decoration: none;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

button:hover, a:hover {
  text-decoration: underline;
}
</style>
