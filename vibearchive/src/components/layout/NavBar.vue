<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="glass-panel">
    <div class="container nav-content">
      <RouterLink to="/" class="logo">
        <span class="gradient-text">Vibe-Archive</span>
      </RouterLink>
      
      <div class="links">
        <RouterLink to="/projects" class="nav-item">Work</RouterLink>
        <RouterLink to="/analytics" class="nav-item">Stats</RouterLink>
        <RouterLink to="/projects/new" class="cta-btn">
            <span>+ New</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 1.2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(20, 24, 36, 0.95);
  backdrop-filter: blur(10px); /* Optional: slight blur for sticky header feel if desired, or remove if user hates blur */
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem; /* Add internal padding */
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  text-transform: uppercase;
}

.links {
  display: flex;
  gap: 3rem;
  align-items: center;
}

.nav-item {
  position: relative;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.nav-item:hover {
    opacity: 1;
}

.nav-item::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0%;
    height: 1px;
    background: var(--accent-cyan);
    transition: width 0.3s var(--ease-spring);
}

.nav-item:hover::after {
    width: 100%;
}

.cta-btn {
    background: var(--gradient-main);
    padding: 0.6rem 1.5rem;
    border-radius: 30px;
    font-weight: 600;
    color: white;
    box-shadow: 0 0 20px rgba(123, 47, 247, 0.4);
    transition: transform 0.3s var(--ease-spring), box-shadow 0.3s;
}

.cta-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
}
</style>
