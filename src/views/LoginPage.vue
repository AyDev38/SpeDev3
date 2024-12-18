<template>
  <div class="container mt-5">
    <div class="card mx-auto" style="max-width: 400px;">
      <div class="card-body">
        <h2 class="card-title text-center">Connexion</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <input
              v-model="username"
              type="text"
              placeholder="Nom d'utilisateur"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <input
              v-model="password"
              type="password"
              placeholder="Mot de passe"
              class="form-control"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">Se connecter</button>
        </form>
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
      </div>
    </div>
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

async function login() {
  // Appel de la méthode "authenticate" avec vérification du hashage
  const isAuthenticated = await authStore.authenticate(username.value, password.value);
  if (isAuthenticated) {
    router.push('/projects');
  } else {
    error.value = 'Nom d’utilisateur ou mot de passe incorrect.';
  }
}
</script>
