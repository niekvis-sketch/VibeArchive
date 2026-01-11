<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserProfile } from '../composables/useUserProfile'

const { getAllUsers, loading, error } = useUserProfile()
const router = useRouter()
const users = ref([])

onMounted(async () => {
    users.value = await getAllUsers()
})

const navigateToUser = (userId) => {
    router.push(`/users/${userId}`)
}
</script>

<template>
  <div class="user-list-container">
      <h1 class="glow-text mb-4">Discover Creators</h1>
      
      <div v-if="loading" class="loading-state">
          Searching the archives...
      </div>
      
      <div v-else-if="error" class="error-state">
          {{ error }}
      </div>
      
      <div v-else class="users-grid">
          <div 
            v-for="user in users" 
            :key="user.id" 
            class="user-card glass-panel"
            @click="navigateToUser(user.id)"
          >
              <div class="user-avatar">
                  <img :src="user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.displayName" alt="User Avatar">
              </div>
              <div class="user-info">
                  <h3>{{ user.displayName || 'Unknown User' }}</h3>
                  <span class="muted">Joined {{ new Date(user.createdAt?.seconds * 1000).toLocaleDateString() }}</span>
              </div>
              <div class="card-glow"></div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.user-list-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
}

.user-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s var(--ease-spring);
    position: relative;
    overflow: hidden;
    text-align: center;
}

.user-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
}

.user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
    transition: transform 0.3s;
}

.user-card:hover .user-avatar {
    transform: scale(1.1);
    border-color: var(--primary-color);
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-info h3 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--text-primary);
}

.muted {
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.card-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 100%, rgba(0, 212, 255, 0.1), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.user-card:hover .card-glow {
    opacity: 1;
}

.mb-4 { margin-bottom: 2rem; }
</style>