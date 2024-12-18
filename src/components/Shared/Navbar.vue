<!-- src\components\Shared\Navbar.vue -->
<template>
  <nav class="navbar">
    <!-- Section de gauche -->
    <div>
      <router-link to="/">Accueil</router-link>
      <router-link v-if="authStore.currentUser" to="/projects">Projets</router-link>
    </div>

    <!-- Section de droite -->
    <div>
      <span v-if="authStore.currentUser" class="username">
        {{ username }}
      </span>
      <button v-if="authStore.currentUser" @click="logout">Déconnexion</button>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Propriété calculée pour obtenir le nom d'utilisateur
const username = computed(() => authStore.currentUser?.username || 'Utilisateur');

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

/* Style pour le nom d'utilisateur */
.username {
  margin-right: 15px;
  font-weight: bold;
  color: #ffdd57; /* Couleur différente pour le nom */
}
</style>
