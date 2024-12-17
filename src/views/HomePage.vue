<template>
    <div class="home-page">
      <h1>Bienvenue sur le Projet XYZ</h1>
      <p>Ce projet est une démonstration simple pour la gestion des utilisateurs et des rôles.</p>
      <div class="buttons">
        <router-link to="/login"><button>Login</button></router-link>
        <router-link to="/register"><button>Register</button></router-link>
      </div>
    </div>
  </template>
  
  <style scoped>
  .home-page {
    text-align: center;
    margin-top: 50px;
  }
  
  h1 {
    color: #333;
    font-size: 2.5rem;
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
  
  button {
    margin: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  