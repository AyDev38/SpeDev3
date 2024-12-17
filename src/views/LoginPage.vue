<template>
    <div class="auth-page">
      <h2>Connexion</h2>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Nom d'utilisateur" required />
        <input v-model="password" type="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
      <p>Pas de compte ? <router-link to="/register">S'enregistrer</router-link></p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import store from '../store/store';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter();
  
  function login() {
    if (store.authenticate(username.value, password.value)) {
      router.push('/projects');
    } else {
      error.value = 'Identifiants incorrects.';
    }
  }
  </script>
  
  <style scoped>
  @import "../styles/auth.css";
  </style>
  