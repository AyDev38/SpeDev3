<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Accueil</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li v-if="authStore.currentUser" class="nav-item d-flex align-items-center">
            <!-- Afficher la photo de profil -->
            <div v-if="profilePicture" class="me-2">
              <img
                :src="profilePicture"
                alt="Photo de profil"
                class="rounded-circle"
                style="width: 40px; height: 40px; object-fit: cover;"
              />
            </div>
            <span class="text-light me-2">{{ username }}</span>
            <button
              @click="logout"
              class="btn btn-outline-light btn-sm"
            >
              Déconnexion
            </button>
          </li>
          <li v-else class="nav-item d-flex">
            <router-link class="nav-link" to="/login">Login</router-link>
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
        </ul>
      </div>
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

// Propriété calculée pour la photo de profil
const profilePicture = computed(() => authStore.currentUser?.profilePicture || null);

function logout() {
  authStore.logout();
  router.push('/');
}
</script>
