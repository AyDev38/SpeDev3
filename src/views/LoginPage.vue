<template>
    <div class="auth-page">
      <h2>Connexion</h2>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Nom d'utilisateur" required />
        <input v-model="password" type="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/authStore';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const username = ref('');
  const password = ref('');
  const error = ref('');
  
  function login() {
    if (authStore.authenticate(username.value, password.value)) {
      router.push('/projects');
    } else {
      error.value = 'Identifiants incorrects.';
    }
  }
  </script>
  
  <style scoped>
  @import "../styles/auth.css";
  </style>
  