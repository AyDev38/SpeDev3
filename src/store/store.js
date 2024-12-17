import { ref } from 'vue';

const data = JSON.parse(localStorage.getItem('projectData')) || {
  users: [],
  projects: [],
};

const currentUser = ref(null); // Rendre l'état réactif

const store = {
  // Authentifie un utilisateur
  authenticate(username, password) {
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
      currentUser.value = user;
      this.save();
      return true;
    }
    return false;
  },

  // Déconnecte l'utilisateur actuel
  logout() {
    currentUser.value = null;
    this.save();
  },

  // Enregistre un nouvel utilisateur
  register(username, password, roles) {
    if (data.users.find(u => u.username === username)) {
      return { success: false, message: "Nom d'utilisateur déjà pris." };
    }
    data.users.push({ id: Date.now(), username, password, roles });
    this.save();
    return { success: true, message: 'Inscription réussie !' };
  },

  // Récupère l'utilisateur actuel (réactif)
  getCurrentUser() {
    return currentUser;
  },

  // Récupère les projets
  getProjects() {
    return data.projects || [];
  },

  // Ajoute un projet
  addProject(name) {
    data.projects.push({ id: Date.now(), name, tasks: [] });
    this.save();
  },

  save() {
    localStorage.setItem('projectData', JSON.stringify(data));
  },
};

export default store;
