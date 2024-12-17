<!-- src\views\ProjectDetailPage.vue -->
<template>
    <div v-if="project">
      <h1>{{ project.name }}</h1>
  
      <!-- Section Assignation Manager -->
      <div class="manager-section">
        <h3>Managers assignés :</h3>
        <ul>
          <li v-for="managerId in project.assignedManagers" :key="managerId">
            {{ getUserLogin(managerId) }}
          </li>
        </ul>
        <button v-if="isManager && !isAssigned" @click="assignManager">
          M'assigner à ce projet
        </button>
        <span v-if="isAssigned">Vous êtes assigné à ce projet.</span>
      </div>
  
      <!-- Section Création de tâches -->
      <div class="task-creation-section" v-if="isManager && isAssigned">
        <h3>Créer une tâche</h3>
        <form @submit.prevent="createTask">
          <input v-model="taskName" placeholder="Nom de la tâche" required />
          <select v-model="selectedDeveloperId" required>
            <option value="" disabled>Choisir un développeur</option>
            <option v-for="dev in developers" :key="dev.id" :value="dev.id">
              {{ dev.username }}
            </option>
          </select>
          <button type="submit">Créer la tâche</button>
        </form>
      </div>
  
      <!-- Section Tâches -->
      <div class="task-section">
        <h3>Liste des tâches</h3>
        <ul>
          <li v-for="task in project.tasks" :key="task.id">
            {{ task.name }} - Statut :
            <span>
              <select
                v-model="task.status"
                @change="updateTaskStatus(task.id, task.status)"
                v-if="isManager || task.assignedTo === userId"
              >
                <option value="Non validé">Non validé</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
              <span v-else>{{ task.status }}</span>
            </span>
  
            <!-- Liste déroulante pour changer le développeur (Manager uniquement) -->
            <div v-if="isManager">
              <label>Développeur assigné :</label>
              <select
                v-model="task.assignedTo"
                @change="updateTaskDeveloper(task.id, task.assignedTo)"
              >
                <option value="" disabled>Choisir un développeur</option>
                <option v-for="dev in developers" :key="dev.id" :value="dev.id">
                  {{ dev.username }}
                </option>
              </select>
            </div>
          </li>
        </ul>
        <p v-if="project.tasks.length === 0">Aucune tâche dans ce projet.</p>
      </div>
  
      <!-- Retour -->
      <router-link to="/projects">Retour aux projets</router-link>
    </div>
    <div v-else>
      <p>Chargement en cours...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProjectStore } from '@/stores/projectStore';
  import { useAuthStore } from '@/stores/authStore';
  
  const route = useRoute();
  const projectStore = useProjectStore();
  const authStore = useAuthStore();
  
  const project = ref(null);
  const taskName = ref('');
  const selectedDeveloperId = ref('');
  const developers = ref([]);
  
  const userId = computed(() => authStore.currentUser?.id);
  const roles = computed(() => authStore.currentUser?.roles);
  const isManager = computed(() => roles.value?.includes('manager'));
  const isAssigned = computed(() => project.value?.assignedManagers?.includes(userId.value));
  
  onMounted(() => {
    const projectId = Number(route.params.id);
    project.value = projectStore.getProjectById(projectId);
    developers.value = authStore.getDevelopers();
  });
  
  function getUserLogin(userId) {
    const user = authStore.getUserById(userId);
    return user ? user.username : 'Utilisateur inconnu';
  }
  
  function assignManager() {
    projectStore.assignManagerToProject(project.value.id, userId.value);
    project.value = projectStore.getProjectById(project.value.id);
  }
  
  function createTask() {
    if (taskName.value && selectedDeveloperId.value) {
      projectStore.addTaskToProject(project.value.id, taskName.value, selectedDeveloperId.value);
      taskName.value = '';
      selectedDeveloperId.value = '';
      project.value = projectStore.getProjectById(project.value.id);
    }
  }
  
  function updateTaskStatus(taskId, newStatus) {
    projectStore.updateTaskStatus(project.value.id, taskId, newStatus);
    project.value = projectStore.getProjectById(project.value.id);
  }
  
  function updateTaskDeveloper(taskId, newDeveloperId) {
    projectStore.updateTaskDeveloper(project.value.id, taskId, newDeveloperId);
    project.value = projectStore.getProjectById(project.value.id);
  }
  </script>
  
  <style scoped>
  .manager-section,
  .task-section,
  .task-creation-section {
    margin: 20px 0;
  }
  
  button,
  select,
  input {
    margin: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin: 10px 0;
  }
  
  label {
    margin-right: 5px;
  }
  </style>
  