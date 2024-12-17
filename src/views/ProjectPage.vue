<template>
  <div class="project-page">
    <h1>Liste des Projets</h1>

    <!-- Section pour les Managers : Ajouter un projet -->
    <div v-if="isManager" class="add-project-form">
      <h2>Ajouter un projet</h2>
      <form @submit.prevent="addProject">
        <input v-model="newProjectName" type="text" placeholder="Nom du projet" required />
        <button type="submit">Créer</button>
      </form>
    </div>

    <!-- Liste des projets -->
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
import { ref, computed, watchEffect } from 'vue';
import store from '../store/store';

// Récupération de l'utilisateur actuel
const user = store.getCurrentUser().value || null;

// Vérifie si l'utilisateur est manager
const isManager = computed(() => user?.roles?.includes('manager') ?? false);

// Liste des projets
const projects = ref([]);
const newProjectName = ref('');

// Met à jour les projets dynamiquement
watchEffect(() => {
  const fetchedProjects = store.getProjects();
  projects.value = Array.isArray(fetchedProjects) ? fetchedProjects : [];
});

// Ajouter un projet
function addProject() {
  if (newProjectName.value.trim()) {
    store.addProject(newProjectName.value);
    newProjectName.value = '';
    projects.value = store.getProjects();
  }
}

// Modifier un projet
function editProject(projectId) {
  const project = projects.value.find(p => p.id === projectId);
  const newName = prompt('Nouveau nom du projet', project.name);
  if (newName) {
    store.updateProject(projectId, newName);
    projects.value = store.getProjects();
  }
}

// Supprimer un projet
function deleteProject(projectId) {
  if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
    store.deleteProject(projectId);
    projects.value = store.getProjects();
  }
}
</script>

<style scoped>
.project-page {
  padding: 20px;
}

h1 {
  font-size: 2rem;
}

.add-project-form input {
  margin-right: 10px;
  padding: 5px;
}

.project-list {
  list-style: none;
  padding: 0;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.actions button {
  margin-left: 5px;
  cursor: pointer;
}
</style>
