<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserProfile } from '../composables/useUserProfile'
import { useProjects } from '../composables/useProjects'

const route = useRoute()
const { getUserProfile } = useUserProfile()
const { getUserProjects, loading: projectsLoading } = useProjects()

const user = ref(null)
const projects = ref([])
const loading = ref(true)
const userId = route.params.id

onMounted(async () => {
    try {
        const [userProfile, userProjects] = await Promise.all([
            getUserProfile(userId),
            getUserProjects(userId)
        ])
        user.value = userProfile
        projects.value = userProjects
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>

<template>
  <div class="public-profile-container">
      <div v-if="loading" class="loading">Loading profile...</div>
      
      <div v-else-if="!user" class="error">User not found</div>
      
      <div v-else>
          <!-- User Header -->
          <div class="profile-header glass-panel mb-8">
              <div class="avatar-large">
                  <img :src="user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.displayName" alt="Profile">
              </div>
              <div class="profile-details">
                  <h1 class="gradient-text">{{ user.displayName }}</h1>
                  <p class="bio">{{ user.bio || 'No bio yet.' }}</p>
              </div>
          </div>

          <!-- Public Projects Grid -->
          <h2 class="section-title">Public Projects</h2>
          
          <div v-if="projects.length === 0" class="empty-state">
              This user hasn't posted any projects yet.
          </div>

          <div v-else class="projects-grid">
              <div v-for="project in projects" :key="project.id" class="project-mini-card glass-panel">
                  <div class="project-image">
                       <img :src="project.imageUrl || '/PlaceholderFoto.svg'" alt="Project Image">
                  </div>
                  <div class="project-info">
                      <h3>
                        <RouterLink :to="{ name: 'project-detail', params: { id: project.id }}" class="project-title-link">
                            {{ project.name }}
                        </RouterLink>
                      </h3>
                      <div class="card-actions">
                         <RouterLink :to="{ name: 'project-detail', params: { id: project.id }, hash: '#comments-section' }" class="comment-link">
                            💬 Comment
                         </RouterLink>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.public-profile-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
}

@media (max-width: 640px) {
    .public-profile-container {
        padding: 1rem;
    }
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
}

@media (max-width: 640px) {
    .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
        padding: 1.5rem;
    }
}

.avatar-large {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--primary-color);
    flex-shrink: 0;
}

@media (max-width: 640px) {
    .avatar-large {
        width: 100px;
        height: 100px;
    }
}

.avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-details h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
}

@media (max-width: 640px) {
    .profile-details h1 {
        font-size: 1.75rem;
    }
}

.bio {
    color: var(--text-secondary);
    max-width: 600px;
}

.section-title {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 0.5rem;
}

@media (max-width: 640px) {
    .section-title {
        font-size: 1.25rem;
    }
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5rem;
}

@media (max-width: 640px) {
    .projects-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}

/* Mini Card - Reduced Info as requested */
.project-mini-card {
    overflow: hidden;
    transition: transform 0.2s;
}

.project-mini-card:hover {
    transform: translateY(-2px);
}

.project-image {
    aspect-ratio: 16/9;
    background: rgba(0,0,0,0.3);
    overflow: hidden;
}

.project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.project-info {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 640px) {
    .project-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
}

.project-title-link {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s;
}

.project-title-link:hover {
    color: var(--color-primary);
}

.card-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-shrink: 0;
}

.comment-link {
    font-size: 0.9rem;
    color: var(--text-secondary);
    transition: color 0.2s;
}

.comment-link:hover {
    color: var(--color-primary);
    text-decoration: underline;
}

.project-info h3 {
    margin: 0;
    font-size: 1.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    margin-right: 0.5rem;
    min-width: 0;
}

@media (max-width: 640px) {
    .project-info h3 {
        white-space: normal;
        font-size: 1.1rem;
        margin-right: 0;
    }
}

.live-link {
    font-size: 0.8rem;
    color: var(--primary-color);
    text-decoration: none;
    border: 1px solid var(--primary-color);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s;
    white-space: nowrap;
}

.live-link:hover {
    background: var(--primary-color);
    color: #fff;
}

.mb-8 { margin-bottom: 3rem; }
.empty-state {
    color: var(--text-secondary);
    text-align: center;
    padding: 3rem;
    font-style: italic;
}
</style>