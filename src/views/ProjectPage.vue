<template>
  <div class="project-page">
    <h1>Liste des Projets</h1>
    <div v-if="isManager" class="add-project-form">
      <h2>Ajouter un projet</h2>
      <form @submit.prevent="addProject">
        <input v-model="newProjectName" type="text" placeholder="Nom du projet" required />
        <button type="submit">Créer</button>
      </form>
    </div>

    <ul v-if="projects.length > 0" class="project-list">
      <li v-for="project in projects" :key="project.id" class="project-item">
        <span>{{ project.name }}</span>
        <div v-if="isManager" class="actions">
          <button @click="editProject(project.id)">Modifier</button>
          <button @click="deleteProject(project.id)">Supprimer</button>
        </div>
      </li>
    </ul>
    <p v-else>Aucun projet disponible.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';

const projectStore = useProjectStore();
const authStore = useAuthStore();

const user = computed(() => authStore.getCurrentUser());
const isManager = computed(() => user.value?.roles?.includes('manager') ?? false);

const projects = ref([]);
const newProjectName = ref('');

onMounted(() => {
  projects.value = projectStore.getProjects();
});

function addProject() {
  projectStore.addProject(newProjectName.value);
  newProjectName.value = '';
  projects.value = projectStore.getProjects();
}

function editProject(projectId) {
  const newName = prompt('Nouveau nom du projet');
  if (newName) {
    projectStore.updateProject(projectId, newName);
    projects.value = projectStore.getProjects();
  }
}

function deleteProject(projectId) {
  if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
    projectStore.deleteProject(projectId);
    projects.value = projectStore.getProjects();
  }
}
</script>

<style scoped>
.project-page {
  padding: 20px;
}
</style>
