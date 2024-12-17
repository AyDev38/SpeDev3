import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// Création et utilisation de Pinia
const pinia = createPinia();
app.use(pinia);

// Utilisation du router
app.use(router);

app.mount('#app');
