<template>
  <div>
    <h1>Gestion des Projets</h1>

    <!-- Ajouter un projet (Manager uniquement) -->
    <div v-if="isManager">
      <h3>Créer un projet</h3>
      <form @submit.prevent="createProject">
        <input v-model="newProjectName" placeholder="Nom du projet" required />
        <button type="submit">Créer</button>
      </form>
    </div>

    <!-- Liste des projets -->
    <ul>
      <li v-for="project in projects" :key="project.id">
        <!-- Nom du projet cliquable -->
        <router-link :to="`/projects/${project.id}`">{{ project.name }}</router-link>
        <!-- Actions Modifier et Supprimer -->
        <template v-if="isManager">
          <button @click="editProject(project.id)">Modifier</button>
          <button @click="deleteProject(project.id)">Supprimer</button>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { useAuthStore } from '@/stores/authStore';

const projectStore = useProjectStore();
const authStore = useAuthStore();

const projects = ref([]);
const newProjectName = ref('');

// Récupérer les informations de l'utilisateur
const userId = computed(() => authStore.currentUser?.id);
const roles = computed(() => authStore.currentUser?.roles);
const isManager = computed(() => roles.value?.includes('manager'));

// Charger les projets
function loadProjects() {
  if (userId.value && roles.value) {
    projects.value = projectStore.getProjectsForUser(userId.value, roles.value);
  }
}

onMounted(() => {
  loadProjects();
});

// Watch pour s'assurer que les projets se rechargent si l'utilisateur change
watch([userId, roles], () => {
  loadProjects();
});

// Ajouter un projet (Manager uniquement)
function createProject() {
  if (isManager.value) {
    projectStore.addProject(newProjectName.value, userId.value);
    newProjectName.value = '';
    loadProjects();
  } else {
    console.error('Vous devez être Manager pour ajouter un projet.');
  }
}

// Modifier un projet
function editProject(id) {
  const newName = prompt('Nouveau nom du projet :');
  if (newName) {
    projectStore.updateProject(id, newName, roles.value);
    loadProjects();
  }
}

function deleteProject(id) {
  if (confirm('Confirmez-vous la suppression ?')) {
    projectStore.deleteProject(id, roles.value);
    loadProjects();
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

a {
  text-decoration: none;
  color: #007bff;
  font-size: 1.2rem;
  margin-right: 10px;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
