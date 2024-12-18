// src/stores/projectStore.js
import { defineStore } from 'pinia';

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    projects: JSON.parse(localStorage.getItem('projects')) || [],
  }),

  actions: {
    // Obtenir tous les projets
    getProjects() {
      return this.projects;
    },

    // Obtenir un projet par ID
    getProjectById(projectId) {
      return this.projects.find((project) => project.id === projectId);
    },

    // Obtenir les projets selon le rôle de l'utilisateur
    getProjectsForUser(userId, roles) {
      if (roles.includes('manager')) {
        return this.projects; // Managers voient tous les projets
      }
      return this.projects.filter((project) =>
        project.tasks.some((task) => task.assignedTo === userId)
      ); // Devs voient les projets avec leurs tâches
    },

    // Ajouter un projet
    addProject(name, managerId) {
      this.projects.push({
        id: Date.now(),
        name,
        managerId,
        deadline,
        tasks: [],
        assignedManagers: [], // Liste des managers assignés
      });
      this.saveProjects();
    },

    // Modifier le nom d'un projet
    updateProject(projectId, newName) {
      const project = this.getProjectById(projectId);
      if (project) {
        project.name = newName;
        this.saveProjects();
      }
    },

    // Supprimer un projet
    deleteProject(projectId) {
      this.projects = this.projects.filter((project) => project.id !== projectId);
      this.saveProjects();
    },

    // Assigner un manager à un projet
    assignManagerToProject(projectId, managerId) {
      const project = this.getProjectById(projectId);
      if (project && !project.assignedManagers.includes(managerId)) {
        project.assignedManagers.push(managerId);
        this.saveProjects();
      }
    },

    // Ajouter une tâche à un projet
    addTaskToProject(projectId, taskName, developerId) {
      const project = this.getProjectById(projectId);
      if (project) {
        project.tasks.push({
          id: Date.now(),
          name: taskName,
          assignedTo: developerId,
          status: 'Non validé',
          comments: [], // Initialisation des commentaires
        });
        this.saveProjects();
      }
    },

    // Modifier le statut d'une tâche
    updateTaskStatus(projectId, taskId, newStatus) {
      const project = this.getProjectById(projectId);
      if (project) {
        const task = project.tasks.find((t) => t.id === taskId);
        if (task) {
          task.status = newStatus;
          this.saveProjects();
        }
      }
    },

    // Modifier l'utilisateur assigné à une tâche
    updateTaskDeveloper(projectId, taskId, newDeveloperId) {
      const project = this.getProjectById(projectId);
      if (project) {
        const task = project.tasks.find((t) => t.id === taskId);
        if (task) {
          task.assignedTo = newDeveloperId;
          this.saveProjects();
        }
      }
    },

    // Ajouter un commentaire à une tâche
    addCommentToTask(projectId, taskId, comment) {
      const project = this.getProjectById(projectId);
      if (project) {
        const task = project.tasks.find((t) => t.id === taskId);
        if (task) {
          task.comments.push({
            id: Date.now(),
            text: comment,
            createdAt: new Date(),
          });
          this.saveProjects();
        }
      }
    },

    // Sauvegarder les projets dans le localStorage
    saveProjects() {
      localStorage.setItem('projects', JSON.stringify(this.projects));
    },
  },
});
