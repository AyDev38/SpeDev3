<!-- src\App.vue -->
<template>
  <div>
    <Navbar />
    <router-view /> <!-- Affiche les routes -->
  </div>
</template>

<script setup>
import Navbar from './components/Shared/Navbar.vue';
</script>

<style>
/* Styles globaux (optionnels) */
body {
  font-family: Arial, sans-serif;
  margin: 0;
}
</style>
