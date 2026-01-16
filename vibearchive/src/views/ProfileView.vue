<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useUserProfile } from '../composables/useUserProfile'
import BaseButton from '../components/ui/BaseButton.vue'

const { user } = useAuth()
const { getUserProfile, updateUserProfile, loading, error } = useUserProfile()

const isEditing = ref(false)
const profile = ref(null)
const selectedPhoto = ref(null)
const photoPreview = ref(null)
const validationError = ref(null)

const form = ref({
    displayName: '',
    bio: '',
    username: '',
    email: ''
})

onMounted(async () => {
    if (user.value) {
        await loadProfile()
    }
})

const loadProfile = async () => {
    const data = await getUserProfile(user.value.uid)
    profile.value = data
    initForm(data)
}

const initForm = (data) => {
    form.value = {
        displayName: data.displayName || user.value?.displayName || '',
        bio: data.bio || '',
        username: data.username || '',
        email: data.email || user.value?.email || ''
    }
}

const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            validationError.value = 'Image too big. Max 5MB.'
            return
        }
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            validationError.value = 'Invalid format. Only JPG/PNG allowed.'
            return
        }
        validationError.value = null
        selectedPhoto.value = file
        photoPreview.value = URL.createObjectURL(file)
    }
}

const saveProfile = async () => {
    validationError.value = null
    try {
        await updateUserProfile(user.value.uid, {
            displayName: form.value.displayName,
            bio: form.value.bio,
            username: form.value.username
        }, selectedPhoto.value)
        
        isEditing.value = false
        await loadProfile() // Refresh
    } catch (err) {
        validationError.value = err.message
        console.error(err)
    }
}

const cancelEdit = () => {
    isEditing.value = false
    selectedPhoto.value = null
    photoPreview.value = null
    validationError.value = null
    if (profile.value) {
        initForm(profile.value)
    }
}

// Derived stats
const memberSince = computed(() => {
    if (!profile.value?.createdAt) return 'N/A'
    const date = profile.value.createdAt.toDate ? profile.value.createdAt.toDate() : new Date(profile.value.createdAt)
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
})

</script>

<template>
  <div class="container profile-page" v-if="profile">
      
      <div v-if="validationError" class="error-banner">
          {{ validationError }}
      </div>

      <div class="profile-grid">
          
          <!-- Left Column: Profile Card -->
          <div class="profile-card glass-panel">
              <div class="avatar-section">
                  <div class="avatar-wrapper">
                    <img 
                        :src="photoPreview || profile.photoURL || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user.uid" 
                        class="avatar"
                    >
                    <label v-if="isEditing" class="edit-avatar-overlay">
                        <input type="file" hidden @change="handlePhotoSelect" accept="image/png, image/jpeg">
                        <span class="icon">📷</span>
                    </label>
                  </div>
              </div>
              
              <div class="profile-identity">
                  <h2>{{ profile.displayName }}</h2>
                  <p class="username">@{{ profile.username || 'username' }}</p>
                  <p class="joined">Member since {{ memberSince }}</p>
              </div>

              <div class="stats-grid">
                  <div class="stat-item">
                      <span class="value">{{ profile.stats?.totalProjects || 0 }}</span>
                      <span class="label">Projects</span>
                  </div>
                  <div class="stat-item">
                      <span class="value">{{ profile.stats?.totalComments || 0 }}</span>
                      <span class="label">Comments</span>
                  </div>
              </div>
              
              <div class="action-buttons">
                  <BaseButton v-if="!isEditing" @click="isEditing = true" class="w-full">
                      Edit Profile
                  </BaseButton>
              </div>
          </div>

          <!-- Right Column: Details & Edit -->
          <div class="profile-details glass-panel">
              <div class="details-header">
                  <h3>About Me</h3>
                  <div v-if="isEditing" class="edit-actions">
                      <BaseButton variant="secondary" @click="cancelEdit">Cancel</BaseButton>
                      <BaseButton :loading="loading" @click="saveProfile">Save Changes</BaseButton>
                  </div>
              </div>

              <div class="details-content">
                  
                  <div class="form-group">
                      <label>Display Name</label>
                      <input 
                        v-if="isEditing" 
                        v-model="form.displayName" 
                        class="input-field" 
                        placeholder="Your display name"
                      />
                      <div v-else class="display-value">{{ profile.displayName }}</div>
                  </div>

                  <div class="form-group">
                      <label>Username (URL Slug)</label>
                      <input 
                        v-if="isEditing" 
                        v-model="form.username" 
                        class="input-field" 
                        placeholder="unique-username"
                      />
                      <div v-else class="display-value">@{{ profile.username || 'Not set' }}</div>
                  </div>

                  <div class="form-group">
                      <label>Bio</label>
                      <textarea 
                        v-if="isEditing" 
                        v-model="form.bio" 
                        class="textarea-field" 
                        rows="5"
                        placeholder="Tell use about yourself... (Markdown supported)"
                        maxlength="500"
                      ></textarea>
                      <div v-else class="bio-display">{{ profile.bio || 'No bio yet.' }}</div>
                      <div v-if="isEditing" class="char-count">{{ form.bio.length }}/500</div>
                  </div>

                  <div class="form-group">
                      <label>Email</label>
                      <div class="email-row">
                          <div class="display-value">{{ profile.email }}</div>
                          <BaseButton v-if="isEditing" variant="secondary" size="small">Change Email</BaseButton>
                      </div>
                  </div>

                  <div class="form-group" v-if="!isEditing">
                        <label>Favorite Tech Stack</label>
                        <div class="tech-tags">
                            <span class="tag">Vue.js</span>
                            <span class="tag">Firebase</span>
                            <!-- Placeholder data for now -->
                        </div>
                  </div>

              </div>
          </div>

      </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding-top: 1rem;
  padding-bottom: 4rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .profile-grid {
    grid-template-columns: 320px 1fr;
  }
}

.glass-panel {
  background: var(--bg-card);
  border: var(--border-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.profile-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-section {
  margin-bottom: 1.5rem;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.1);
}

.edit-avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--speed-fast);
}

.edit-avatar-overlay:hover {
  opacity: 1;
}

.icon {
  font-size: 1.5rem;
}

.profile-identity h2 {
  font-size: 1.375rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.username {
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
}

.joined {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.25rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-item .label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.action-buttons {
  width: 100%;
}

.w-full {
  width: 100%;
}

.profile-details {
  padding: 2rem;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.details-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.edit-actions {
  display: flex;
  gap: 0.75rem;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.display-value {
  font-size: 1rem;
  color: var(--text-primary);
}

.bio-display {
  white-space: pre-wrap;
  line-height: 1.7;
  color: var(--text-secondary);
}

.input-field,
.textarea-field {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 0.875rem 1rem;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  transition: all var(--speed-fast);
}

.input-field:focus,
.textarea-field:focus {
  outline: none;
  border-color: var(--accent-orange);
  box-shadow: 0 0 0 3px var(--accent-orange-glow);
}

.textarea-field {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.email-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--accent-danger);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tech-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  background: rgba(255, 107, 53, 0.1);
  color: var(--accent-orange);
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 107, 53, 0.15);
}
</style>
