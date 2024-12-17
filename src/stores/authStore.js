import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [],
    currentUser: null,
  }),

  actions: {
    register(username, password, roles) {
      if (this.users.find((u) => u.username === username)) {
        return { success: false, message: "Nom d'utilisateur déjà pris." };
      }
      this.users.push({ id: Date.now(), username, password, roles });
      this.saveUsers();
      return { success: true, message: 'Inscription réussie !' };
    },

    authenticate(username, password) {
      const user = this.users.find((u) => u.username === username && u.password === password);
      if (user) {
        this.currentUser = user;
        this.saveUsers();
        return true;
      }
      return false;
    },

    logout() {
      this.currentUser = null;
      this.saveUsers();
    },

    saveUsers() {
      localStorage.setItem('users', JSON.stringify(this.users));
    },

    getCurrentUser() {
      return this.currentUser;
    },
  },
});
