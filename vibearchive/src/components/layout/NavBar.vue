<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import NotificationBell from '../ui/NotificationBell.vue'

const { user, logout } = useAuth()
const router = useRouter()

const showUserMenu = ref(false)
const mobileMenuOpen = ref(false)

const handleLogout = async () => {
    await logout()
    showUserMenu.value = false
    mobileMenuOpen.value = false
    router.push('/login')
}

// Click outside directive logic or simple toggle
const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
    mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      <RouterLink :to="user ? '/projects' : '/'" class="logo">
        <span class="logo-text">Vibe-Archive</span>
        <span class="logo-accent">✦</span>
      </RouterLink>
      
      <!-- Desktop Nav Links -->
      <div class="nav-links">
        <template v-if="user">
          <RouterLink to="/" class="nav-item">Home</RouterLink>
          <RouterLink to="/projects" class="nav-item">Projects</RouterLink>
          <RouterLink to="/users" class="nav-item">Users</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/" class="nav-item">Home</RouterLink>
          <RouterLink to="/login" class="nav-item">About</RouterLink>
          <RouterLink to="/login" class="nav-item">Projects</RouterLink>
        </template>
      </div>

      <div class="nav-actions">
        <template v-if="user">
          <RouterLink to="/projects/new" class="btn-cta desktop-only">
            <span>+ New Project</span>
          </RouterLink>
          
          <!-- Notification Bell -->
          <NotificationBell class="desktop-only" />
          
          <!-- User Menu -->
          <div class="user-menu-wrapper desktop-only">
            <div class="user-avatar" @click="toggleUserMenu">
              <img :src="user.photoURL || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user.uid" />
            </div>

            <div v-if="showUserMenu" class="dropdown-menu">
              <div class="user-info">
                <p class="name">{{ user.displayName || 'User' }}</p>
                <p class="email">{{ user.email }}</p>
              </div>
              <div class="menu-divider"></div>
              <RouterLink to="/profile" class="menu-item" @click="showUserMenu = false">
                <span class="menu-icon">👤</span> Profile
              </RouterLink>
              <RouterLink to="/analytics" class="menu-item" @click="showUserMenu = false">
                <span class="menu-icon">📊</span> Analytics
              </RouterLink>
              <RouterLink to="/settings" class="menu-item" @click="showUserMenu = false">
                <span class="menu-icon">⚙️</span> Settings
              </RouterLink>
              <div class="menu-divider"></div>
              <button class="menu-item danger" @click="handleLogout">
                <span class="menu-icon">🚪</span> Logout
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/signup" class="btn-cta desktop-only">Get in touch</RouterLink>
        </template>
        
        <!-- Hamburger Menu Button (Mobile Only) -->
        <button class="hamburger-btn" @click="toggleMobileMenu" :class="{ 'is-active': mobileMenuOpen }">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu"></div>
    </Transition>
    
    <!-- Mobile Menu -->
    <Transition name="mobile-slide">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <div class="mobile-menu-content">
          <!-- User Info (if logged in) -->
          <div v-if="user" class="mobile-user-info">
            <div class="mobile-user-avatar">
              <img :src="user.photoURL || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user.uid" />
            </div>
            <div class="mobile-user-details">
              <p class="mobile-user-name">{{ user.displayName || 'User' }}</p>
              <p class="mobile-user-email">{{ user.email }}</p>
            </div>
          </div>
          
          <div class="mobile-nav-links">
            <template v-if="user">
              <RouterLink to="/" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">🏠</span> Home
              </RouterLink>
              <RouterLink to="/projects" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">📁</span> Projects
              </RouterLink>
              <RouterLink to="/users" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">👥</span> Users
              </RouterLink>
              <RouterLink to="/projects/new" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">➕</span> New Project
              </RouterLink>
              
              <div class="mobile-menu-divider"></div>
              
              <RouterLink to="/profile" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">👤</span> Profile
              </RouterLink>
              <RouterLink to="/analytics" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">📊</span> Analytics
              </RouterLink>
              <RouterLink to="/settings" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">⚙️</span> Settings
              </RouterLink>
              
              <div class="mobile-menu-divider"></div>
              
              <button class="mobile-nav-item danger" @click="handleLogout">
                <span class="mobile-nav-icon">🚪</span> Logout
              </button>
            </template>
            <template v-else>
              <RouterLink to="/" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">🏠</span> Home
              </RouterLink>
              <RouterLink to="/login" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">ℹ️</span> About
              </RouterLink>
              <RouterLink to="/login" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">📁</span> Projects
              </RouterLink>
              
              <div class="mobile-menu-divider"></div>
              
              <RouterLink to="/login" class="mobile-nav-item" @click="closeMobileMenu">
                <span class="mobile-nav-icon">🔑</span> Login
              </RouterLink>
              <RouterLink to="/signup" class="mobile-nav-item highlight" @click="closeMobileMenu">
                <span class="mobile-nav-icon">✨</span> Get Started
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 1rem 0;
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 768px) {
  .nav-content {
    padding: 0 40px;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.logo-accent {
  color: var(--accent-orange);
  font-size: 0.875rem;
}

.nav-links {
  display: none;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-item {
  position: relative;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  transition: color var(--speed-fast) var(--ease-smooth);
  cursor: pointer;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--text-primary);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--accent-orange);
  border-radius: 1px;
  transition: width var(--speed-normal) var(--ease-spring);
}

.nav-item:hover::after,
.nav-item.router-link-active::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  background: var(--accent-orange);
  color: white;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--speed-fast) var(--ease-smooth);
}

.btn-cta:hover {
  background: var(--accent-orange-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accent-orange-glow);
  color: white;
}

/* User Menu */
.user-menu-wrapper {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color var(--speed-fast);
}

.user-avatar:hover {
  border-color: var(--accent-orange);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 260px;
  background: var(--bg-card);
  border: var(--border-card);
  border-radius: var(--radius-lg);
  padding: 0.5rem 0;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  animation: dropdownFade 0.2s var(--ease-smooth);
}

@keyframes dropdownFade {
  from { 
    opacity: 0; 
    transform: translateY(-8px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.user-info {
  padding: 0.75rem 1rem;
}

.user-info .name { 
  font-weight: 600; 
  color: var(--text-primary); 
  font-size: 0.9375rem;
}

.user-info .email { 
  font-size: 0.8125rem; 
  color: var(--text-muted); 
  text-overflow: ellipsis; 
  overflow: hidden; 
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.5rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  color: var(--text-secondary);
  transition: all var(--speed-fast);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  font-family: var(--font-body);
  cursor: pointer;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.menu-icon {
  font-size: 1rem;
  width: 1.25rem;
  text-align: center;
}

.menu-item.danger {
  color: var(--accent-danger);
}

.menu-item.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Hamburger Button */
.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}

@media (min-width: 768px) {
  .hamburger-btn {
    display: none;
  }
}

.hamburger-line {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s var(--ease-smooth);
}

.hamburger-btn.is-active .hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger-btn.is-active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-btn.is-active .hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Desktop Only Items */
.desktop-only {
  display: none;
}

@media (min-width: 768px) {
  .desktop-only {
    display: flex;
  }
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 99;
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  max-width: 85vw;
  height: 100vh;
  background: var(--bg-card);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 100;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-menu-content {
  padding: 80px 20px 24px;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--accent-orange);
}

.mobile-user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-user-details {
  flex: 1;
  min-width: 0;
}

.mobile-user-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.mobile-user-email {
  font-size: 0.8125rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--speed-fast) var(--ease-smooth);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-body);
}

.mobile-nav-item:hover,
.mobile-nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
}

.mobile-nav-item.highlight {
  background: var(--accent-orange);
  color: white;
}

.mobile-nav-item.highlight:hover {
  background: var(--accent-orange-light);
}

.mobile-nav-item.danger {
  color: var(--accent-danger);
}

.mobile-nav-item.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.mobile-nav-icon {
  font-size: 1.125rem;
  width: 24px;
  text-align: center;
}

.mobile-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 12px 0;
}

/* Mobile Menu Transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s var(--ease-smooth);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: transform 0.3s var(--ease-smooth);
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  transform: translateX(100%);
}
</style>
