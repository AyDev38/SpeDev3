<template>
  <div class="project-container">
    <h1>Gestion des Projets</h1>

    <!-- Section Ajouter un projet (Manager uniquement) -->
    <div v-if="isManager" class="add-project-section">
      <h3>Créer un projet</h3>
      <form @submit.prevent="createProject" class="add-project-form">
        <input v-model="newProjectName" placeholder="Nom du projet" required />
        <button type="submit">Créer</button>
      </form>
    </div>

    <!-- Liste des projets sous forme de cartes -->
    <div class="project-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <router-link :to="`/projects/${project.id}`" class="project-title">
          {{ project.name }}
        </router-link>

        <!-- Actions (Manager uniquement) -->
        <div v-if="isManager" class="project-actions">
          <button class="edit-btn" @click="editProject(project.id)">Modifier</button>
          <button class="delete-btn" @click="deleteProject(project.id)">Supprimer</button>
        </div>
      </div>
    </div>
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

// Supprimer un projet
function deleteProject(id) {
  if (confirm('Confirmez-vous la suppression ?')) {
    projectStore.deleteProject(id, roles.value);
    loadProjects();
  }
}
</script>

<style scoped>
.project-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.add-project-section {
  margin-bottom: 20px;
  text-align: center;
}

.add-project-form input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.add-project-form button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-project-form button:hover {
  background-color: #0056b3;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.project-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 10px;
}

.project-title:hover {
  text-decoration: underline;
}

.project-actions {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.edit-btn {
  background-color: #ffc107;
  color: white;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>
