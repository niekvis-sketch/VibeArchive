<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
    await logout()
    router.push('/login')
}
</script>

<template>
  <nav class="glass-panel">
    <div class="container nav-content">
      <RouterLink to="/" class="logo">
        <span class="gradient-text">Vibe-Archive</span>
      </RouterLink>
      
      <div class="links">
        <template v-if="user">
          <RouterLink to="/projects" class="nav-item">Work</RouterLink>
          <RouterLink to="/analytics" class="nav-item">Stats</RouterLink>
          <RouterLink to="/projects/new" class="cta-btn">
              <span>+ New</span>
          </RouterLink>
          <div class="user-menu" @click="handleLogout">
              <span class="logout-btn">Logout</span>
          </div>
        </template>
        <template v-else>
           <RouterLink to="/login" class="nav-item">Login</RouterLink>
           <RouterLink to="/signup" class="cta-btn">Join</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Keeping existing styles... */
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 1.2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(20, 24, 36, 0.95);
  backdrop-filter: blur(10px); 
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
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
  cursor: pointer;
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

.logout-btn {
    font-size: 0.9rem;
    opacity: 0.6;
    cursor: pointer;
    transition: opacity 0.3s;
}
.logout-btn:hover {
    opacity: 1;
    color: #ff4d4d;
}
</style>
