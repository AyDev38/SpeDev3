// src/stores/projectStore.js
import { defineStore } from 'pinia';
import { useAuthStore } from './authStore.js';

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
    getProjectByIdSecure(projectId, userId, isManager=false) {
      var projectRecup = null;
      console.log(isManager)
      projectRecup =  this.projects.find((project) => project.id === projectId);
      const hasTaskWithUser = projectRecup.tasks.some((task) => task.assignedTo === userId);
      if (isManager || hasTaskWithUser ) return projectRecup
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
    addProject(name, managerId, deadline, createdat) {
      this.projects.push({
        id: Date.now(),
        name,
        managerId,
        deadline,
        createdat,
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

    getProjectStats(projectId) {
      const project = this.getProjectById(projectId);
      if (project) {
        const totalTasks = project.tasks.length;
        const nonValidated = project.tasks.filter(task => task.status === "À faire").length;
        const inProgress = project.tasks.filter(task => task.status === "En cours").length;
        const completed = project.tasks.filter(task => task.status === "Terminée").length;
    
        return { totalTasks, nonValidated, inProgress, completed };
      }
      return { totalTasks: 0, nonValidated: 0, inProgress: 0, completed: 0 };
    },

    getDeadlineColor(deadline) {
      const now = new Date();
      const diff = (new Date(deadline) - now) / (1000 * 60 * 60 * 24); // Différence en jours
    
      if (diff > 30) return "text-success"; // Vert
      if (diff > 7) return "text-warning"; // Jaune
      if (diff > 1) return "text-orange"; // Orange
      return diff >= 0 ? "text-danger" : "bg-danger text-white"; // Rouge si dépassé
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
        // Vérifie si le manager est toujours assigné
        project.tasks.push({
          id: Date.now(),
          name: taskName,
          assignedTo: developerId,
          status: 'À faire',
          order: project.tasks.length,
          comments: [],
          validated: false,
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

    updateTask(projectId, updatedTask) {
      const project = this.getProjectById(projectId);
      if (project) {
        const taskIndex = project.tasks.findIndex((task) => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...updatedTask };
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

    addCommentToTask(projectId, taskId, commentText, userId) {
      const project = this.getProjectById(projectId);
      if (project) {
        const task = project.tasks.find((t) => t.id === taskId);
        if (task) {
          task.comments.push({
            id: Date.now(),
            text: commentText,
            createdAt: new Date().toISOString(),
            authorId: userId,
          });
          this.saveProjects();
        }
      }
    },

    // Modifier le nom d'une tâche
    updateTaskName(projectId, taskId, newName) {
      const project = this.getProjectById(projectId);
      if (project) {
        const task = project.tasks.find((t) => t.id === taskId);
        if (task) {
          task.name = newName;
          this.saveProjects();
        }
      }
    },

    // Supprimer une tâche
    deleteTask(projectId, taskId) {
      const project = this.getProjectById(projectId);
      if (project) {
        project.tasks = project.tasks.filter((task) => task.id !== taskId);
        this.saveProjects();
      }
    },

    // Supprimer un commentaire spécifique
    deleteComment(projectId, taskId, commentId) {
      const project = this.getProjectById(projectId);
      if (project) {
        const task = project.tasks.find((t) => t.id === taskId);
        if (task) {
          task.comments = task.comments.filter(
            (comment) => comment.id !== commentId
          );
          this.saveProjects();
        }
      }
    },

    // Retirer un manager d'un projet
    removeManagerFromProject(projectId, managerId) {
      const project = this.getProjectById(projectId);
      if (project) {
        project.assignedManagers = project.assignedManagers.filter((id) => id !== managerId);
        this.saveProjects();
      }
    },

    // Valider une tâche
    validateTask(projectId, taskId) {
      const project = this.getProjectById(projectId);
      if (project) {
        const task = project.tasks.find((t) => t.id === taskId);
        if (task && task.status === "Terminée") {
          task.validated = true;
          this.saveProjects();
        }
      }
    },

    // Dévalider une tâche
    invalidateTask(projectId, taskId) {
      const project = this.getProjectById(projectId);
      if (project) {
        const task = project.tasks.find((t) => t.id === taskId);
        if (task) {
          task.validated = false;
          this.saveProjects();
        }
      }
    },


  },
});
