<!-- src\views\ProjectDetailPage.vue -->
<template>
  <div v-if="project" class="container my-5">
    <!-- Titre du projet -->
    <header class="text-center mb-4">
      <h1>{{ project.name }}</h1>
      <!-- Info sur les dates du projets -->
      <p class="text-muted">
        Créé le : {{ formatDate(project.createdat) }} | Date de fin :
        {{ formatDate(project.deadline) }}
      </p>
    </header>

    <!-- Section Managers -->
    <div class="card mb-4">
      <div class="card-body">
        <h3 class="card-title">Managers assignés</h3>
        <div class="mb-3">
          <span
            v-for="managerId in project.assignedManagers"
            :key="managerId"
            class="badge bg-primary me-2"
          >
            {{ getUserLogin(managerId) }}
          </span>
        </div>
        <div>
          <button
            v-if="isManager && isAssigned"
            @click="removeManager"
            class="btn btn-danger me-2"
          >
            Me retirer de ce projet
          </button>
          <button
            v-if="isManager && !isAssigned"
            @click="assignManager"
            class="btn btn-primary"
          >
            M'assigner à ce projet
          </button>
        </div>
      </div>
    </div>

    <!-- Création de Tâches -->
    <div v-if="(isManager && isAssigned) || !isManager" class="card mb-4">
      <div class="card-body">
        <h3 class="card-title">Créer une tâche</h3>
        <form @submit.prevent="createTask" class="row g-3">
          <!-- Champ pour le nom de la tâche -->
          <div class="col-md-6">
            <input
              v-model="taskName"
              @input="taskName = sanitizeInput(taskName)"
              type="text"
              placeholder="Nom de la tâche"
              class="form-control"
              required
            />
          </div>
          <!-- Sélection du développeur assigné -->
          <div v-if="isManager && isAssigned" class="col-md-4">
            <select v-model="selectedDeveloperId" class="form-select" required>
              <option value="" disabled>Choisir un développeur</option>
              <option v-for="dev in developers" :key="dev.id" :value="dev.id">
                {{ dev.username }}
              </option>
            </select>
          </div>
          <!-- Bouton pour soumettre -->
          <div class="col-md-2">
            <button type="submit" class="btn btn-primary w-100">Créer</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Kanban Board -->
    <div class="row">
      <div
        v-for="status in taskStatuses"
        :key="status"
        class="col-md-4 mb-4"
        :class="{ 'bg-light': isDraggingOver === status }"
        @dragover.prevent="onDragOverColumn(status)"
        @drop="onDropColumn(status)"
      >
        <div class="card">
          <div class="card-header text-center bg-secondary text-white">
            <h4 class="card-title">{{ status }}</h4>
          </div>
          <div class="card-body">
            <div
              v-for="(task, index) in getTasksByStatus(status)"
              :key="task.id"
              class="card mb-3"
              :class="{
                'draggable-task': !task.validated,
                'not-draggable': task.validated,
              }"
              :draggable="false"
            >
            <div
              class="card-header drag-handle"
              :class="{ 'not-allowed': task.validated }"
              :draggable="!task.validated"
              @dragstart="!task.validated && onDragStart(task.id, status)"
            ></div>
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title m-0">{{ task.name }}</h5>
                    <span v-if="task.validated" class="badge bg-success ms-2">Validée</span>
                  </div>
                 
                <p class="card-text">
                  Assigné à :
                  <span v-if="isManager">
                    <select
                      v-model="task.assignedTo"
                      class="form-select form-select-sm"
                      @change="updateTaskDeveloper(task.id, task.assignedTo)"
                      :disabled="task.validated"
                    >
                      <option
                        v-for="dev in developers"
                        :key="dev.id"
                        :value="dev.id"
                      >
                        {{ dev.username }}
                      </option>
                    </select>
                  </span>
                  <span v-else>{{ getUserLogin(task.assignedTo) }}</span>
                </p>
                <div class="">
                  <div
                    v-if="isManager"
                    class="d-flex justify-content-between mb-2"
                  >
                    <button
                      @click="editTaskName(task.id)"
                      class="btn btn-warning btn-sm"
                      :disabled="task.validated"
                    >
                      Modifier Nom
                    </button>

                    <button
                      v-if="task.status === 'Terminée' && !task.validated"
                      @click="validateTask(task)"
                      class="btn btn-success btn-sm"
                    >
                      Valider
                    </button>
                    <button
                      v-if="task.validated"
                      @click="unvalidateTask(task)"
                      class="btn btn-warning btn-sm"
                    >
                      Dévalider
                    </button>

                    <button
                      v-if="isManager"
                      @click="deleteTask(task.id)"
                      class="btn btn-danger btn-sm"
                      :disabled="task.validated"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <button
                  @click="toggleComments(task.id)"
                  class="btn btn-outline-secondary btn-sm w-100"
                >
                  {{ openComments[task.id] ? "Masquer" : "Afficher" }} les
                  commentaires
                </button>
              </div>
              <!-- Section des commentaires -->
              <div v-if="openComments[task.id]" class="mt-3">
                <div class="list-group">
                  <div
                    v-for="comment in task.comments"
                    :key="comment.id"
                    class="list-group-item"
                  >
                    <div class="d-flex justify-content-between">
                      <strong>{{ getUserLogin(comment.text.authorId) }}</strong>
                      <small class="text-muted">{{
                        new Date(comment.createdAt).toLocaleString()
                      }}</small>
                      <button
                        v-if="comment.text.authorId === userId"
                        @click="deleteComment(task.id, comment.id)"
                        class="btn btn-sm btn-danger"
                      >
                        Supprimer
                      </button>
                    </div>
                    <p class="mb-0">{{ comment.text.text }}</p>
                  </div>
                </div>
                <!-- Ajouter un commentaire -->
                <form @submit.prevent="addComment(task.id)" class="mt-3">
                  <div class="input-group">
                    <input
                      v-model="newComment[task.id]"
                      type="text"
                      class="form-control"
                      placeholder="Écrire un commentaire..."
                    />
                    <button type="submit" class="btn btn-primary">
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Retour -->
    <div class="text-center">
      <router-link to="/projects" class="btn btn-link"
        >Retour aux projets</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const authStore = useAuthStore();

const project = ref(null);
const developers = ref([]);
const taskName = ref("");
const selectedDeveloperId = ref("");
const draggedTaskId = ref(null);
const draggedFromStatus = ref(null);
const isDraggingOver = ref(null);

const newComment = ref({});
const openComments = ref({});

const taskStatuses = ["À faire", "En cours", "Terminée"];
const userId = computed(() => authStore.currentUser?.id);
const roles = computed(() => authStore.currentUser?.roles);
const isManager = computed(() => roles.value?.includes("manager"));
const isAssigned = computed(() =>
  project.value?.assignedManagers.includes(userId.value)
);

onMounted(() => {
  const projectId = Number(route.params.id);
  project.value = projectStore.getProjectByIdSecure(
    projectId,
    userId.value,
    isManager.value
  );
  if (!project.value) {
    // Redirection vers la page 404 si aucun projet n'est trouvé
    router.push({ name: "NotFound" });
  } else {
    developers.value = authStore.getDevelopers();
  }
  console.log("PROJECT.VALUE", project.value);
});

const getTasksByStatus = (status) => {
  return (
    project.value?.tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.order - b.order) || []
  );
};

function onDragStart(taskId, status) {
  draggedTaskId.value = taskId;
  draggedFromStatus.value = status;
}

function onDragOverColumn(status) {
  isDraggingOver.value = status;
}

function onDropColumn(status) {
  if (draggedTaskId.value && draggedFromStatus.value !== status) {
    const draggedTask = project.value.tasks.find(
      (task) => task.id === draggedTaskId.value
    );
    if (draggedTask) {
      draggedTask.status = status;
      const targetTasks = getTasksByStatus(status);
      draggedTask.order = targetTasks.length;
      projectStore.saveProjects();
      reloadProject();
    }
  }
  isDraggingOver.value = null;
}

function onDragOverTask(index) {
  // Gestion visuelle additionnelle si nécessaire
}

function onDropTask(index, status) {
  if (draggedTaskId.value && draggedFromStatus.value === status) {
    const tasks = getTasksByStatus(status);
    const draggedTask = tasks.find((task) => task.id === draggedTaskId.value);

    tasks.splice(index, 0, tasks.splice(tasks.indexOf(draggedTask), 1)[0]);
    tasks.forEach((task, i) => (task.order = i));
    projectStore.saveProjects();
    reloadProject();
  }
}

function assignManager() {
  projectStore.assignManagerToProject(project.value.id, userId.value);
  reloadProject();
}

function createTask() {
  if (taskName.value) {
    const developerId = isManager.value
      ? selectedDeveloperId.value
      : userId.value;

    projectStore.addTaskToProject(
      project.value.id,
      taskName.value,
      developerId
    );

    taskName.value = "";
    selectedDeveloperId.value = "";
    reloadProject();
  }
}

function updateTaskDeveloper(taskId, developerId) {
  projectStore.updateTaskDeveloper(project.value.id, taskId, developerId);
  reloadProject();
}

function editTaskName(taskId) {
  const newName = prompt("Nouveau nom de la tâche :");
  if (newName) {
    projectStore.updateTaskName(project.value.id, taskId, newName);
    reloadProject();
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
    newComment.value[taskId] = "";
    reloadProject();
  }
}

function toggleComments(taskId) {
  openComments.value[taskId] = !openComments.value[taskId];
}

function deleteTask(taskId) {
  if (confirm("Confirmez-vous la suppression de cette tâche ?")) {
    projectStore.deleteTask(project.value.id, taskId);
    reloadProject();
  }
}

function deleteComment(taskId, commentId) {
  if (confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
    projectStore.deleteComment(
      project.value.id,
      taskId,
      commentId,
      userId.value
    );
    reloadProject();
  }
}

function removeManager() {
  if (confirm("Voulez-vous vraiment vous retirer de ce projet ?")) {
    projectStore.removeManagerFromProject(project.value.id, userId.value);
    reloadProject();
  }
}

function validateTask(task) {
  task.validated = true;
  projectStore.updateTask(project.value.id, task);
  reloadProject();
}

function unvalidateTask(task) {
  task.validated = false;
  projectStore.updateTask(project.value.id, task);
  reloadProject();
}

function formatDate(timestamp) {
  if (!timestamp) return "Non spécifiée";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(timestamp).toLocaleDateString("fr-FR", options);
}
</script>

<style scoped>

.drag-handle {
  height: 20px;
  background-color: #6c757d; /* Gris */
  cursor: grab;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  user-select: none; /* Désactive la sélection du texte */
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle.not-allowed {
  cursor: not-allowed; /* Curseur interdit si validé */
  opacity: 0.5; /* Rend la barre visuellement désactivée */
}


</style>
