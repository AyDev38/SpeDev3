<template>
    <div class="not-found">
      <h1>404 - Page introuvable</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <router-link to="/projects">Retour aux projets</router-link>
    </div>
  </template>
  
  <script setup>
  // Aucun script nécessaire
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  h1 {
    font-size: 2rem;
    color: #ff6347;
  }
  
  p {
    margin: 10px 0;
    font-size: 1.2rem;
  }
  
  a {
    text-decoration: none;
    color: #007bff;
  }
  </style>
  