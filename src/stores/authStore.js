// src/stores/authStore.js
import { defineStore } from 'pinia';
import bcrypt from 'bcryptjs';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [], // Utilisateurs enregistrés
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null, // Utilisateur actuel
  }),

  actions: {
    getDevelopers() {
      return this.users.filter((user) => user.roles.includes('developer'));
    },

    getUserById(userId) {
      return this.users.find((user) => user.id === userId);
    },

    async register(username, password, roles) {
      const existingUser = this.users.find((u) => u.username === username);
      if (existingUser) return { success: false, message: "Nom d'utilisateur déjà pris." };

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = { id: Date.now(), username, password: hashedPassword, roles };
      this.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(this.users));
      return { success: true, message: 'Inscription réussie !' };
    },

    async authenticate(username, password) {
      const user = this.users.find((u) => u.username === username);
      if (!user) return false;

      // Vérifier le mot de passe
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      return false;
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    },

    saveUsers() {
      localStorage.setItem('users', JSON.stringify(this.users));
    },

    getCurrentUser() {
      return this.currentUser;
    },
  },
});
