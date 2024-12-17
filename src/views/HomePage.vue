<template>
    <div>
      <h1>Bienvenue sur le Projet XYZ</h1>
      <p>Ce projet est une démonstration simple pour la gestion des utilisateurs et des rôles.</p>
      <router-link to="/login"><button>Login</button></router-link>
      <router-link to="/register"><button>Register</button></router-link>
    </div>
  </template>
  
  <style scoped>
  h1 {
    color: #333;
    margin-bottom: 10px;
  }
  
  button {
    margin: 10px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  