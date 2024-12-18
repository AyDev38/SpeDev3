<!-- src\views\RegisterPage.vue -->
<template>
    <div class="auth-page">
      <h2>Inscription</h2>
      <form @submit.prevent="register">
        <input v-model="username" placeholder="Nom d'utilisateur" required />
        <input v-model="password" type="password" placeholder="Mot de passe" required />
        <label>
          <input type="checkbox" v-model="roles.manager" /> Manager
        </label>
        <label>
          <input type="checkbox" v-model="roles.developer" /> Developer
        </label>
        <button type="submit">S'inscrire</button>
      </form>
      <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
      <p>Déjà un compte ? <router-link to="/login">Se connecter</router-link></p>
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
  const roles = ref({ manager: false, developer: false });
  const message = ref('');
  const success = ref(false);
  
  function register() {
    const selectedRoles = [];
    if (roles.value.manager) selectedRoles.push('manager');
    if (roles.value.developer) selectedRoles.push('developer');
  
    if (selectedRoles.length === 0) {
      message.value = 'Veuillez sélectionner au moins un rôle.';
      success.value = false;
      return;
    }
  
    const result = authStore.register(username.value, password.value, selectedRoles);
    if (result.success) {
      success.value = true;
      message.value = result.message;
      router.push('/login');
    } else {
      success.value = false;
      message.value = result.message;
    }
  }
  </script>
    

