<template>
  <div class="container mt-5">
    <div class="card mx-auto" style="max-width: 400px;">
      <div class="card-body">
        <h2 class="card-title text-center">Inscription</h2>
        <form @submit.prevent="register">
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
          <div class="mb-3">
            <label class="form-check-label">
              <input type="checkbox" v-model="roles.manager" class="form-check-input" />
              Manager
            </label>
          </div>
          <div class="mb-3">
            <label class="form-check-label">
              <input type="checkbox" v-model="roles.developer" class="form-check-input" />
              Développeur
            </label>
          </div>
          <!-- Ajout du champ de dépôt d'image -->
          <div class="mb-3">
            <label for="profilePicture" class="form-label">Photo de profil (optionnel)</label>
            <input type="file" id="profilePicture" @change="onFileChange" class="form-control" />
          </div>
          <!-- Affichage de l'aperçu de l'image -->
          <div v-if="preview" class="mb-3 text-center">
            <img :src="preview" alt="Aperçu de la photo" class="img-thumbnail" style="max-width: 150px;" />
          </div>
          <button type="submit" class="btn btn-primary w-100">S'inscrire</button>
        </form>
        <p v-if="message" :class="success ? 'text-success mt-2' : 'text-danger mt-2'">
          {{ message }}
        </p>
        <p class="mt-3 text-center">
          Déjà un compte ? <router-link to="/login" class="text-decoration-none">Se connecter</router-link>
        </p>
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
const roles = ref({ manager: false, developer: false });
const message = ref('');
const success = ref(false);
const profilePicture = ref(null);
const preview = ref(null);

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    profilePicture.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function register() {
  const selectedRoles = [];
  if (roles.value.manager) selectedRoles.push('manager');
  if (roles.value.developer) selectedRoles.push('developer');

  if (selectedRoles.length === 0) {
    message.value = 'Veuillez sélectionner au moins un rôle.';
    success.value = false;
    return;
  }

  const newUser = {
    username: username.value,
    password: password.value,
    roles: selectedRoles,
    profilePicture: preview.value,
  };

  const result = await authStore.register(newUser);
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
