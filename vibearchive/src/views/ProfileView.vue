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
    padding-top: 2rem;
    padding-bottom: 4rem;
}

.profile-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 2rem;
    align-items: start;
}

@media (max-width: 768px) {
    .profile-grid {
        grid-template-columns: 1fr;
    }
}

.glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
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
    width: 150px;
    height: 150px;
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255, 255, 255, 0.1);
}

.edit-avatar-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
}

.edit-avatar-overlay:hover {
    opacity: 1;
}

.icon {
    font-size: 2rem;
}

.profile-identity h2 {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
    color: #fff;
}

.username {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.5rem;
}

.joined {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 2rem;
}

.stats-grid {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    width: 100%;
    justify-content: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem 0;
}

.stat-item {
    display: flex;
    flex-direction: column;
}

.stat-item .value {
    font-size: 1.25rem;
    font-weight: bold;
    color: #fff;
}

.stat-item .label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
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
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 1rem;
}

.details-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
}

.edit-actions {
    display: flex;
    gap: 1rem;
}

.details-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
}

.display-value {
    font-size: 1.1rem;
    color: #fff;
}

.bio-display {
    white-space: pre-wrap;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
}

.input-field, .textarea-field {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: white;
    font-family: inherit;
    transition: border-color 0.2s;
}

.input-field:focus, .textarea-field:focus {
    outline: none;
    border-color: var(--primary-color, #6366f1);
}

.textarea-field {
    resize: vertical;
}

.char-count {
    text-align: right;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 0.25rem;
}

.email-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.error-banner {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.5);
    color: #fca5a5;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.tech-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.tag {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
}
</style>
