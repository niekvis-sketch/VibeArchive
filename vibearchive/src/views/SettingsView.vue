<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useUserProfile } from '../composables/useUserProfile'
import BaseButton from '../components/ui/BaseButton.vue'

const { user } = useAuth()
const { getUserProfile, updateUserProfile, loading: saving, error } = useUserProfile()

const activeTab = ref('general')
const loading = ref(true)
const originalSettings = ref(null)
const settings = ref({
    privacy: {},
    preferences: {},
    notifications: {}
})
const hasChanges = ref(false)

const tabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'data', label: 'Data & Privacy' }
]

onMounted(async () => {
    if (user.value) {
        const profile = await getUserProfile(user.value.uid)
        if (profile?.settings) {
            settings.value = JSON.parse(JSON.stringify(profile.settings))
            originalSettings.value = JSON.parse(JSON.stringify(profile.settings))
        }
        loading.value = false
    }
})

// Deep watch for changes
watch(settings, (newVal) => {
    if (!originalSettings.value) return
    hasChanges.value = JSON.stringify(newVal) !== JSON.stringify(originalSettings.value)
}, { deep: true })

const saveSettings = async () => {
    try {
        await updateUserProfile(user.value.uid, { settings: settings.value })
        originalSettings.value = JSON.parse(JSON.stringify(settings.value))
        hasChanges.value = false
        // Show success notification (mock)
        alert('Settings saved!') 
    } catch (err) {
        console.error(err)
        alert('Failed to save settings')
    }
}

const discardChanges = () => {
    settings.value = JSON.parse(JSON.stringify(originalSettings.value))
    hasChanges.value = false
}

</script>

<template>
  <div class="container settings-page">
      <h1 class="glow-text mb-4">Account Settings</h1>
      
      <div v-if="loading" class="loading-state">Loading settings...</div>
      
      <div v-else class="settings-layout">
          <!-- Sidebar Tabs -->
          <div class="settings-sidebar glass-panel">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                class="tab-btn"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
          </div>

          <!-- Content Area -->
          <div class="settings-content glass-panel">
              
              <!-- General Settings -->
              <div v-if="activeTab === 'general'" class="tab-content">
                  <h2>General Preferences</h2>
                  
                  <!-- Display -->
                  <div class="section-title">Display</div>
                  <div class="setting-group">
                      <label>Theme</label>
                      <div class="radio-group">
                         <label class="radio">
                             <input type="radio" value="dark" v-model="settings.preferences.theme"> Dark Mode
                         </label>
                         <label class="radio">
                             <input type="radio" value="light" v-model="settings.preferences.theme"> Light Mode
                         </label>
                         <label class="radio">
                             <input type="radio" value="auto" v-model="settings.preferences.theme"> Auto
                         </label>
                      </div>
                  </div>

                  <div class="setting-group">
                       <label>Accent Color</label>
                       <div class="color-picker">
                           <input type="color" v-model="settings.preferences.accentColor">
                           <span class="color-value">{{ settings.preferences.accentColor }}</span>
                       </div>
                  </div>

                  <div class="setting-group checkbox-row">
                      <label>Compact View</label>
                      <input type="checkbox" v-model="settings.preferences.compactView" class="toggle">
                  </div>

                  <!-- Privacy -->
                  <div class="section-title mt-6">Privacy</div>
                  <div class="setting-group">
                      <label>Profile Visibility</label>
                      <div class="description">Decide who can see your profile page.</div>
                      <select v-model="settings.privacy.profilePublic" class="select-input">
                          <option :value="true">Public</option>
                          <option :value="false">Private</option>
                      </select>
                  </div>
                  
                  <div class="setting-group checkbox-row">
                      <label>Show email on profile</label>
                      <input type="checkbox" v-model="settings.privacy.showEmail" class="toggle">
                  </div>
                  
                  <div class="setting-group checkbox-row">
                      <label>Show stats on profile</label>
                      <input type="checkbox" v-model="settings.privacy.showStats" class="toggle">
                  </div>
              </div>

              <!-- Notification Settings -->
              <div v-if="activeTab === 'notifications'" class="tab-content">
                  <h2>Notifications</h2>
                  
                  <div class="section-title">Email Notifications</div>
                  <div class="setting-group">
                      <label>New comments on my project</label>
                      <select v-model="settings.notifications.emailComments" class="select-input">
                          <option value="instant">Instant</option>
                          <option value="daily">Daily Digest</option>
                          <option value="off">Off</option>
                      </select>
                  </div>
                  
                  <div class="setting-group checkbox-row">
                      <label>Weekly Activity Summary</label>
                      <input type="checkbox" v-model="settings.notifications.weeklyDigest" class="toggle">
                  </div>

                  <div class="setting-group checkbox-row">
                      <label>Product Updates & Announcements</label>
                      <input type="checkbox" v-model="settings.notifications.productUpdates" class="toggle">
                  </div>
                  
                  <div class="section-title mt-6">In-App</div>
                   <div class="setting-group checkbox-row">
                      <label>Desktop Notifications</label>
                      <input type="checkbox" v-model="settings.notifications.desktopNotifications" class="toggle">
                  </div>
                  <div class="setting-group checkbox-row">
                      <label>Sound Effects</label>
                      <input type="checkbox" v-model="settings.notifications.soundEffects" class="toggle">
                  </div>
              </div>
              
               <!-- Security Settings -->
              <div v-if="activeTab === 'security'" class="tab-content">
                  <h2>Security</h2>
                  
                  <div class="setting-group">
                      <label>Change Password</label>
                      <p class="description">Click to reset your password via email.</p>
                      <BaseButton variant="secondary" size="small">Send Reset Email</BaseButton>
                  </div>

                  <div class="section-title mt-6">Sessions</div>
                  <div class="session-item">
                      <div class="session-info">
                          <strong>Windows PC - Chrome</strong>
                          <span class="muted">Active now • Amsterdam, NL</span>
                      </div>
                      <button class="text-btn">Log out</button>
                  </div>
              </div>
              
              <!-- Data & Privacy -->
              <div v-if="activeTab === 'data'" class="tab-content">
                  <h2>Data & Privacy</h2>
                  
                  <div class="setting-group">
                      <label>Export Data</label>
                      <div class="actions-row">
                          <BaseButton variant="secondary" size="small">Export Projects (JSON)</BaseButton>
                          <BaseButton variant="secondary" size="small">Download Screenshots</BaseButton>
                      </div>
                  </div>
                  
                  <div class="setting-group danger-zone mt-8">
                      <label class="danger-text">Delete Account</label>
                      <p class="danger-desc">This action is permanent and cannot be undone.</p>
                      <button class="btn-danger">Delete Permanently</button>
                  </div>
              </div>

          </div>
      </div>
      
      <!-- Sticky Save Bar -->
      <div class="save-bar glass-panel" :class="{ visible: hasChanges }">
          <span>You have unsaved changes</span>
          <div class="save-actions">
              <BaseButton variant="secondary" @click="discardChanges">Discard</BaseButton>
              <BaseButton :loading="saving" @click="saveSettings">Save Changes</BaseButton>
          </div>
      </div>
  </div>
</template>

<style scoped>
.settings-page {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 5rem;
    position: relative;
}

.mb-4 { margin-bottom: 2rem; }
.mt-6 { margin-top: 3rem; }
.mt-8 { margin-top: 4rem; }

.settings-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
}

@media (max-width: 768px) {
    .settings-layout {
        grid-template-columns: 1fr;
    }
}

.settings-sidebar {
    padding: 1rem;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tab-btn {
    text-align: left;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    width: 100%;
}

.tab-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
}

.tab-btn.active {
    background: rgba(99, 102, 241, 0.1);
    color: var(--primary-color, #6366f1);
}

.settings-content {
    padding: 3rem;
    min-height: 500px;
}

.tab-content h2 {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
    font-size: 0.9rem;
    text-transform: uppercase;
    color: var(--primary-color, #6366f1);
    font-weight: bold;
    letter-spacing: 1px;
    margin-bottom: 1.5rem;
}

.setting-group {
    margin-bottom: 2rem;
}

.setting-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.description {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 1rem;
}

/* Inputs */
.select-input {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.75rem;
    border-radius: 6px;
    width: 100%;
    max-width: 300px;
}

.select-input option {
    background: #1a1a1a;
}

.radio-group {
    display: flex;
    gap: 1.5rem;
}

.radio {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.checkbox-row label {
    margin-bottom: 0;
}

.toggle {
    appearance: none;
    width: 44px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
}

.toggle::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.3s;
}

.toggle:checked {
    background: var(--primary-color, #6366f1);
}

.toggle:checked::after {
    transform: translateX(20px);
}

.color-picker {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.color-input {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
}

/* Danger Zone */
.danger-zone {
    border: 1px solid rgba(239, 68, 68, 0.3);
    padding: 1.5rem;
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.05);
}

.danger-text {
    color: #fca5a5;
    font-size: 1.1rem;
}

.danger-desc {
    color: rgba(252, 165, 165, 0.7);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.btn-danger:hover {
    background: #dc2626;
}

/* Save Bar */
.save-bar {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(150%);
    width: 90%;
    max-width: 800px;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 100;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    background: #1a1a1a;
}

.save-bar.visible {
    transform: translateX(-50%) translateY(0);
}

.save-actions {
    display: flex;
    gap: 1rem;
}

.glass-panel {
    background: rgba(25, 30, 45, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
}
</style>
