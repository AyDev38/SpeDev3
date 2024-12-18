<!-- src\views\ProjectDetailPage.vue -->
<template>
    <div v-if="project" class="project-detail-container">
      <!-- Titre du projet -->
      <header class="project-header">
        <h1>{{ project.name }}</h1>
      </header>
  
      <!-- Section Managers -->
      <div class="manager-section card">
        <h3>Managers assignés</h3>
        <div class="manager-tags">
          <span v-for="managerId in project.assignedManagers" :key="managerId" class="tag">
            {{ getUserLogin(managerId) }}
          </span>
        </div>
        <button v-if="isManager && !isAssigned" @click="assignManager" class="btn-primary">
          M'assigner à ce projet
        </button>
      </div>
  
      <!-- Création de Tâches -->
      <div class="task-creation card">
        <h3>Créer une tâche</h3>
        <form @submit.prevent="createTask" class="form-inline">
          <input v-model="taskName" placeholder="Nom de la tâche" required />
          <select v-if="isManager" v-model="selectedDeveloperId" required>
            <option value="" disabled>Choisir un développeur</option>
            <option v-for="dev in developers" :key="dev.id" :value="dev.id">
              {{ dev.username }}
            </option>
          </select>
          <button type="submit" class="btn-primary">Créer</button>
        </form>
      </div>
  
      <!-- Kanban Board -->
      <div class="kanban-board">
        <div
          class="kanban-column"
          v-for="status in taskStatuses"
          :key="status"
          @dragover.prevent
          @drop="onDrop(status)"
        >
          <h3>{{ status }}</h3>
          <div
            class="task-card"
            v-for="task in getTasksByStatus(status)"
            :key="task.id"
            draggable="true"
            @dragstart="onDragStart(task.id)"
          >
            <p class="task-name">{{ task.name }}</p>
            <p class="task-details">Assigné à : {{ getUserLogin(task.assignedTo) }}</p>

            <!-- Bouton pour afficher/masquer les commentaires -->
            <button @click="toggleComments(task.id)" class="btn-toggle-comments">
              {{ openComments[task.id] ? 'Masquer' : 'Afficher' }} les commentaires
            </button>

            <!-- Section des commentaires -->
            <div v-if="openComments[task.id]" class="task-comments">
              <h4>Commentaires</h4>
              <div class="comment-bubble" v-for="comment in task.comments" :key="comment.id">
                <p class="comment-author">{{ getUserLogin(comment.authorId) }}</p>
                <p class="comment-text">{{ comment.text }}</p>
                <p class="comment-date">{{ new Date(comment.createdAt).toLocaleString() }}</p>
              </div>

              <!-- Ajouter un commentaire -->
              <div class="add-comment">
                <input
                  v-model="newComment[task.id]"
                  placeholder="Écrire un commentaire..."
                  class="comment-input"
                />
                <button @click="addComment(task.id)" class="btn-add-comment">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <router-link to="/projects" class="back-link">Retour aux projets</router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useProjectStore } from "@/stores/projectStore";
  import { useAuthStore } from "@/stores/authStore";
  
  const route = useRoute();
  const projectStore = useProjectStore();
  const authStore = useAuthStore();
  
  const project = ref(null);
  const developers = ref([]);
  const taskName = ref("");
  const selectedDeveloperId = ref("");
  const draggedTaskId = ref(null);

  const newComment = ref({});
  const openComments = ref({});

  
  const taskStatuses = ["Non validé", "En cours", "Terminé"];
  const userId = computed(() => authStore.currentUser?.id);
  const roles = computed(() => authStore.currentUser?.roles);
  const isManager = computed(() => roles.value?.includes("manager"));
  const isAssigned = computed(() => project.value?.assignedManagers.includes(userId.value));
  
  onMounted(() => {
    const projectId = Number(route.params.id);
    project.value = projectStore.getProjectById(projectId);
    developers.value = authStore.getDevelopers();
  });
  
  const getTasksByStatus = (status) => {
    return project.value?.tasks.filter((task) => task.status === status) || [];
  };
  
  function onDragStart(taskId) {
    draggedTaskId.value = taskId;
  }
  
  function onDrop(newStatus) {
    if (draggedTaskId.value) {
      projectStore.updateTaskStatus(project.value.id, draggedTaskId.value, newStatus);
      reloadProject();
      draggedTaskId.value = null;
    }
  }
  
  function assignManager() {
    projectStore.assignManagerToProject(project.value.id, userId.value);
    reloadProject();
  }
  
  function createTask() {
    if (taskName.value) {
      const developerId = isManager.value ? selectedDeveloperId.value : userId.value;

      // Assigner la tâche au développeur (choisi si manager, automatique si développeur)
      projectStore.addTaskToProject(project.value.id, taskName.value, developerId);

      taskName.value = ""; // Réinitialiser le champ de tâche
      selectedDeveloperId.value = ""; // Réinitialiser le champ du développeur
      reloadProject(); // Recharger le projet pour afficher la nouvelle tâche
    }
  }
  
  function reloadProject() {
    project.value = projectStore.getProjectById(project.value.id);
  }
  
  function getUserLogin(id) {
    const user = authStore.getUserById(id);
    return user ? user.username : "Utilisateur inconnu";
  }

  function addComment(taskId) {
    if (newComment.value[taskId]) {
      projectStore.addCommentToTask(project.value.id, taskId, {
        text: newComment.value[taskId],
        authorId: userId.value,
        createdAt: new Date().toISOString(),
      });
      newComment.value[taskId] = ""; // Réinitialise le champ de commentaire
      reloadProject(); // Recharge le projet pour mettre à jour les commentaires
    }
  }


  function toggleComments(taskId) {
    openComments.value[taskId] = !openComments.value[taskId];
  }

  </script>
  
  <style scoped>
  .project-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  .project-header h1 {
    text-align: center;
    color: #007bff;
  }
  
  .card {
    background: white;
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .manager-tags .tag {
    display: inline-block;
    background: #007bff;
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    margin-right: 10px;
  }
  
  .kanban-board {
    display: flex;
    gap: 15px;
  }
  
  .kanban-column {
    flex: 1;
    background: #f8f8f8;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .kanban-column h3 {
    text-align: center;
    color: #555;
  }
  
  .task-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: move;
  }
  
  .task-name {
    font-weight: bold;
    color: #333;
  }
  
  .task-details {
    font-size: 0.9em;
    color: #666;
  }
  
  .task-creation form {
    display: flex;
    gap: 10px;
  }
  
  .form-inline input,
  .form-inline select,
  .form-inline button {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .back-link {
    display: block;
    margin-top: 20px;
    text-align: center;
    color: #007bff;
    text-decoration: none;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }

  .task-comments {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.comment-item {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.comment-date {
  font-size: 0.8rem;
  color: #888;
}

.comment-input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn-add-comment {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add-comment:hover {
  background-color: #0056b3;
}

.btn-toggle-comments {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-toggle-comments:hover {
  background-color: #0056b3;
}

.task-comments {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.comment-bubble {
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border-radius: 15px;
  position: relative;
  max-width: 70%;
  word-wrap: break-word;
}

.comment-bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -10px;
  border: 10px solid transparent;
  border-right-color: #007bff;
  border-left: 0;
  margin-top: -10px;
}

.comment-author {
  font-weight: bold;
  margin-bottom: 5px;
}

.comment-text {
  margin: 5px 0;
}

.comment-date {
  font-size: 0.8rem;
  color: #ddd;
  text-align: right;
}

.comment-input {
  width: calc(100% - 60px);
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn-add-comment {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add-comment:hover {
  background-color: #0056b3;
}


  </style>
  