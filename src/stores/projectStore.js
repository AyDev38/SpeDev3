// src\stores\projectStore.js
import { defineStore } from 'pinia';

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    projects: JSON.parse(localStorage.getItem('projects')) || [],
  }),

  actions: {
    getProjects() {
      return this.projects;
    },

    getProjectById(projectId) {
      return this.projects.find((p) => p.id === projectId);
    },

    getProjectsForUser(userId, roles) {
        if (roles.includes('manager')) {
          return this.projects; // Managers voient tous les projets
        }
        // Les développeurs voient uniquement les projets où ils ont des tâches assignées
        return this.projects.filter((project) =>
          project.tasks.some((task) => task.assignedTo === userId)
        );
      },

    addProject(name, managerId) {
      this.projects.push({
        id: Date.now(),
        name,
        managerId,
        tasks: [],
        assignedManagers: [], // Initialise les managers
        assignedDevelopers: [],
      });
      this.saveProjects();
    },

    assignManagerToProject(projectId, managerId) {
      const project = this.getProjectById(projectId);
      if (project && !project.assignedManagers.includes(managerId)) {
        project.assignedManagers.push(managerId);
        this.saveProjects();
      }
    },

    addTaskToProject(projectId, taskName, developerId) {
      const project = this.getProjectById(projectId);
      if (project) {
        project.tasks.push({
          id: Date.now(),
          name: taskName,
          assignedTo: developerId,
          status: 'Non validé',
        });
        this.saveProjects();
      }
    },

    saveProjects() {
      localStorage.setItem('projects', JSON.stringify(this.projects));
    },


    updateProject(projectId, newName, userRoles) {
        if (!userRoles.includes('manager')) {
          console.error('Permission refusée : seul un manager peut modifier un projet.');
          return;
        }
      
        const project = this.projects.find((p) => p.id === projectId);
        if (project) {
          project.name = newName;
          this.saveProjects();
        }
      },
      
      deleteProject(projectId, userRoles) {
        if (!userRoles.includes('manager')) {
          console.error('Permission refusée : seul un manager peut supprimer un projet.');
          return;
        }
      
        this.projects = this.projects.filter((p) => p.id !== projectId);
        this.saveProjects();
      },
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
  },
});
