<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/">Accueil</router-link>
      <router-link v-if="user" to="/projects">Projets</router-link>
    </div>
    <div class="nav-right">
      <!-- Affiche Login et Register si l'utilisateur n'est pas connecté -->
      <router-link v-if="!user" to="/login">Login</router-link>
      <router-link v-if="!user" to="/register">Register</router-link>
      <!-- Affiche Déconnexion si l'utilisateur est connecté -->
      <button v-if="user" @click="logout">Déconnexion</button>
    </div>
  </nav>
</template>

<script setup>
import { watchEffect, ref } from 'vue';
import store from '../../store/store';
import { useRouter } from 'vue-router';

// Router pour rediriger après déconnexion
const router = useRouter();

// Récupération de l'utilisateur actuel (réactif)
const user = ref(null);

// Surveille les changements de currentUser
watchEffect(() => {
  user.value = store.getCurrentUser().value;
});

// Déconnecte l'utilisateur
function logout() {
  store.logout();
  router.push('/'); // Redirection vers l'accueil
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 10px 20px;
}

a, button {
  color: white;
  text-decoration: none;
  margin: 0 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

a:hover, button:hover {
  text-decoration: underline;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
}
</style>
