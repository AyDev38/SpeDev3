<!-- src\views\ProjectPage.vue -->
<template>
  <div class="container my-5">
    <h1 class="text-center">Gestion des Projets</h1>
    <div v-if="isManager" class="mb-4">
      <h3>Créer un projet</h3>
      <form @submit.prevent="createProject" class="row g-3">
        <div class="col-md-6">
          <input
            v-model="newProjectName"
            type="text"
            placeholder="Nom du projet"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="newProjectDeadline"
            type="date"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-2">
          <button type="submit" class="btn btn-primary w-100">Créer</button>
        </div>
      </form>
    </div>
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="col"
      >
        <div class="card h-100">
          <div class="card-body">
            <!-- Titre du projet -->
            <h5 class="card-title">{{ project.name }}</h5>
            
            <!-- Date limite avec couleur -->
            <p class="card-text">
              Échéance : 
              <span :class="getDeadlineColor(project.deadline)">
                {{ formatDeadline(project.deadline) }}
              </span>
            </p>

            <!-- Statistiques des tâches -->
            <p class="card-text">
              <strong>Tâches :</strong>
              Total : {{ getProjectStats(project.id).totalTasks }},
              Non validées : {{ getProjectStats(project.id).nonValidated }},
              En cours : {{ getProjectStats(project.id).inProgress }},
              Terminées : {{ getProjectStats(project.id).completed }}
            </p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <router-link :to="`/projects/${project.id}`" class="btn btn-link">Détails</router-link>
            <div v-if="isManager" class="d-flex gap-2">
              <button
                @click="editProject(project.id)"
                class="btn btn-warning btn-sm"
              >
                Modifier Nom
              </button>
              <button
                @click="deleteProject(project.id)"
                class="btn btn-danger btn-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
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
const newProjectDeadline = ref("");

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
    const currentTimestamp = Date.now();
    projectStore.addProject(newProjectName.value, userId.value, newProjectDeadline.value, currentTimestamp);
    newProjectName.value = '';
    newProjectDeadline.value = '';
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

// Obtenir les statistiques d'un projet
const getProjectStats = (projectId) => projectStore.getProjectStats(projectId);

// Déterminer la couleur de l'échéance
const getDeadlineColor = (deadline) => projectStore.getDeadlineColor(deadline);

// Formater l'affichage de l'échéance
const formatDeadline = (deadline) => {
  if (!deadline) return "Non spécifiée";
  const diff = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return `Délai dépassé (${Math.abs(Math.floor(diff))}j)`;
  return `${Math.ceil(diff)} jours restants`;
};
</script>

<style scoped>
.text-success {
  color: green;
}

.text-warning {
  color: orange;
}

.text-orange {
  color: darkorange;
}

.text-danger {
  color: red;
}

.bg-danger {
  background-color: red;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
