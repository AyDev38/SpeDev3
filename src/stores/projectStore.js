import { defineStore } from 'pinia';

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    projects: JSON.parse(localStorage.getItem('projects')) || [],
  }),

  actions: {
    getProjects() {
      return this.projects;
    },

    addProject(name) {
      this.projects.push({ id: Date.now(), name, tasks: [] });
      this.saveProjects();
    },

    updateProject(projectId, newName) {
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.name = newName;
        this.saveProjects();
      }
    },

    deleteProject(projectId) {
      this.projects = this.projects.filter((p) => p.id !== projectId);
      this.saveProjects();
    },

    saveProjects() {
      localStorage.setItem('projects', JSON.stringify(this.projects));
    },
  },
});
