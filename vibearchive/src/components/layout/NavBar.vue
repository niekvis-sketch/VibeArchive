<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const { user, logout } = useAuth()
const router = useRouter()

const showUserMenu = ref(false)

const handleLogout = async () => {
    await logout()
    showUserMenu.value = false
    router.push('/login')
}

// Click outside directive logic or simple toggle
const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}
</script>

<template>
  <nav class="glass-panel">
    <div class="container nav-content">
      <RouterLink :to="user ? '/projects' : '/'" class="logo">
        <span class="gradient-text">Vibe-Archive</span>
      </RouterLink>
      
      <div class="links">
        <template v-if="user">
          <RouterLink to="/projects" class="nav-item">Work</RouterLink>
          <RouterLink to="/users" class="nav-item">Users</RouterLink>
          <RouterLink to="/analytics" class="nav-item">Stats</RouterLink>
          <RouterLink to="/projects/new" class="cta-btn-small">
              <span>+ New</span>
          </RouterLink>
          
          <!-- User Menu -->
          <div class="nav-icon-wrapper">
              <div class="user-avatar" @click="toggleUserMenu">
                   <img :src="user.photoURL || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user.uid" />
              </div>

               <div v-if="showUserMenu" class="dropdown-menu user-dropdown glass-panel">
                  <div class="user-info">
                      <p class="name">{{ user.displayName || 'User' }}</p>
                      <p class="email">{{ user.email }}</p>
                  </div>
                  <hr>
                  <RouterLink to="/profile" class="menu-item" @click="showUserMenu = false">Profile</RouterLink>
                  <RouterLink to="/settings" class="menu-item" @click="showUserMenu = false">Settings</RouterLink>
                  <hr>
                  <button class="menu-item danger" @click="handleLogout">Logout</button>
              </div>
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
  gap: 2rem;
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

.cta-btn-small {
    background: var(--primary-color, #6366f1);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background 0.3s;
}

.cta-btn-small:hover {
    background: #4f46e5;
}

.cta-btn {
    background: white;
    color: black;
    padding: 0.5rem 1.25rem;
    border-radius: 20px;
    font-weight: 600;
}

/* Icons & Dropdowns */
.nav-icon-wrapper {
    position: relative;
}

.icon-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    position: relative;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background 0.2s;
}

.icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #ef4444;
    color: white;
    font-size: 0.6rem;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #141824;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;
}

.user-avatar:hover {
    border-color: var(--primary-color, #6366f1);
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.dropdown-menu {
    position: absolute;
    top: 120%;
    right: 0;
    width: 280px;
    background: #1e2433; /* Fallback */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem 0;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.user-info {
    padding: 0 1.5rem 0.5rem;
}

.name { font-weight: bold; color: white; }
.email { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); text-overflow: ellipsis; overflow: hidden; }

hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0.5rem 0;
}

.menu-item {
    display: block;
    padding: 0.75rem 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    transition: background 0.2s;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    font-size: 0.95rem;
    font-family: inherit;
    cursor: pointer;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
}

.menu-item.danger {
    color: #f87171;
}

.menu-item.danger:hover {
    background: rgba(248, 113, 113, 0.1);
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
</style>
