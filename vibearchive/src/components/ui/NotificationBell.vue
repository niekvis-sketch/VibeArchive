<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useNotifications } from '../../composables/useNotifications'

const router = useRouter()
const { user } = useAuth()
const { 
  notifications, 
  unreadCount, 
  startListening, 
  stopListening,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getTimeAgo,
  groupedNotifications
} = useNotifications()

const showDropdown = ref(false)
const dropdownRef = ref(null)

// Start listening when user is logged in
watch(user, (newUser) => {
  if (newUser) {
    startListening()
  } else {
    stopListening()
  }
}, { immediate: true })

onUnmounted(() => {
  stopListening()
})

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleNotificationClick = async (notification) => {
  // Mark as read
  if (!notification.read) {
    await markAsRead(notification.id)
  }
  
  // Navigate to the link
  if (notification.link) {
    router.push(notification.link)
  }
  
  showDropdown.value = false
}

const handleDelete = async (event, notificationId) => {
  event.stopPropagation()
  await deleteNotification(notificationId)
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'comment':
      return '💬'
    case 'like':
      return '❤️'
    case 'follow':
      return '👤'
    case 'mention':
      return '@'
    default:
      return '🔔'
  }
}
</script>

<template>
  <div class="notification-wrapper" ref="dropdownRef">
    <button class="notification-bell" @click="toggleDropdown" :class="{ 'has-unread': unreadCount > 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span v-if="unreadCount > 0" class="notification-badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>
    
    <Transition name="dropdown">
      <div v-if="showDropdown" class="notification-dropdown">
        <div class="dropdown-header">
          <h3>Notifications</h3>
          <div class="header-actions">
            <button 
              v-if="unreadCount > 0" 
              @click="markAllAsRead" 
              class="mark-all-btn"
              title="Mark all as read"
            >
              ✓ Mark all read
            </button>
          </div>
        </div>
        
        <div class="notification-list" v-if="notifications.length > 0">
          <!-- Today -->
          <template v-if="groupedNotifications.today.length > 0">
            <div class="date-separator">Today</div>
            <div 
              v-for="notification in groupedNotifications.today" 
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon">
                {{ getNotificationIcon(notification.type) }}
              </div>
              <div class="notification-content">
                <p class="notification-title">{{ notification.title }}</p>
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ getTimeAgo(notification.createdAt) }}</span>
              </div>
              <button 
                class="delete-btn" 
                @click="(e) => handleDelete(e, notification.id)"
                title="Delete notification"
              >
                ×
              </button>
            </div>
          </template>
          
          <!-- Yesterday -->
          <template v-if="groupedNotifications.yesterday.length > 0">
            <div class="date-separator">Yesterday</div>
            <div 
              v-for="notification in groupedNotifications.yesterday" 
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon">
                {{ getNotificationIcon(notification.type) }}
              </div>
              <div class="notification-content">
                <p class="notification-title">{{ notification.title }}</p>
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ getTimeAgo(notification.createdAt) }}</span>
              </div>
              <button 
                class="delete-btn" 
                @click="(e) => handleDelete(e, notification.id)"
                title="Delete notification"
              >
                ×
              </button>
            </div>
          </template>
          
          <!-- This Week -->
          <template v-if="groupedNotifications.thisWeek.length > 0">
            <div class="date-separator">This Week</div>
            <div 
              v-for="notification in groupedNotifications.thisWeek" 
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon">
                {{ getNotificationIcon(notification.type) }}
              </div>
              <div class="notification-content">
                <p class="notification-title">{{ notification.title }}</p>
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ getTimeAgo(notification.createdAt) }}</span>
              </div>
              <button 
                class="delete-btn" 
                @click="(e) => handleDelete(e, notification.id)"
                title="Delete notification"
              >
                ×
              </button>
            </div>
          </template>
          
          <!-- Older -->
          <template v-if="groupedNotifications.older.length > 0">
            <div class="date-separator">Older</div>
            <div 
              v-for="notification in groupedNotifications.older" 
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon">
                {{ getNotificationIcon(notification.type) }}
              </div>
              <div class="notification-content">
                <p class="notification-title">{{ notification.title }}</p>
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ getTimeAgo(notification.createdAt) }}</span>
              </div>
              <button 
                class="delete-btn" 
                @click="(e) => handleDelete(e, notification.id)"
                title="Delete notification"
              >
                ×
              </button>
            </div>
          </template>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">🔔</div>
          <p>No notifications yet</p>
          <span>When someone comments on your projects, you'll see it here.</span>
        </div>
        
        <div v-if="notifications.length > 0" class="dropdown-footer">
          <button @click="clearAllNotifications" class="clear-all-btn">
            Clear all notifications
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notification-wrapper {
  position: relative;
}

.notification-bell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--speed-fast) var(--ease-smooth);
}

.notification-bell:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.notification-bell.has-unread {
  color: var(--accent-orange);
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--accent-orange);
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 380px;
  max-height: 520px;
  background: var(--bg-card);
  border: var(--border-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media (max-width: 480px) {
  .notification-dropdown {
    position: fixed;
    top: 70px;
    right: 16px;
    left: 16px;
    width: auto;
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dropdown-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.mark-all-btn {
  background: none;
  border: none;
  color: var(--accent-orange);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: all var(--speed-fast);
}

.mark-all-btn:hover {
  background: rgba(255, 107, 53, 0.1);
}

.notification-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.date-separator {
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(0, 0, 0, 0.2);
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  cursor: pointer;
  transition: all var(--speed-fast);
  position: relative;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(255, 107, 53, 0.08);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent-orange);
}

.notification-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.notification-message {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.delete-btn {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all var(--speed-fast);
}

.notification-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: var(--accent-danger);
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-state span {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.dropdown-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.clear-all-btn {
  width: 100%;
  padding: 0.625rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--speed-fast);
}

.clear-all-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--accent-danger);
  color: var(--accent-danger);
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s var(--ease-smooth);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
