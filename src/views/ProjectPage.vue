<template>
  <div>
    <h1>Gestion des Projets</h1>
    <!-- Ajouter un projet -->
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
        {{ project.name }}
        <button @click="editProject(project.id)">Modifier</button>
        <button @click="deleteProject(project.id)">Supprimer</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { useAuthStore } from '@/stores/authStore';

const projectStore = useProjectStore();
const authStore = useAuthStore();

const projects = computed(() => projectStore.getProjects());
const isManager = computed(() => authStore.currentUser?.roles.includes('manager'));
const newProjectName = ref('');

function createProject() {
  projectStore.addProject(newProjectName.value, authStore.currentUser.id);
  newProjectName.value = '';
}

function editProject(id) {
  const newName = prompt('Nouveau nom du projet');
  if (newName) projectStore.updateProject(id, newName);
}

function deleteProject(id) {
  if (confirm('Confirmez-vous la suppression ?')) projectStore.deleteProject(id);
}
</script>
