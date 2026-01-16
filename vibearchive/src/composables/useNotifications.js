import { ref, computed } from 'vue'
import { db, auth } from '../firebase/config'
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc,
  writeBatch,
  getDocs,
  limit,
  Timestamp
} from 'firebase/firestore'

// Global state for notifications
const notifications = ref([])
const unreadCount = ref(0)
const loading = ref(false)
const error = ref(null)
let unsubscribe = null

export function useNotifications() {
  
  // Start listening to notifications for the current user
  const startListening = () => {
    if (!auth.currentUser) return
    
    // Unsubscribe from previous listener if exists
    if (unsubscribe) {
      unsubscribe()
    }
    
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      const results = []
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id })
      })
      notifications.value = results
      unreadCount.value = results.filter(n => !n.read).length
    }, (err) => {
      console.error('Error fetching notifications:', err)
      error.value = 'Could not fetch notifications'
    })
  }
  
  // Stop listening
  const stopListening = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    notifications.value = []
    unreadCount.value = 0
  }
  
  // Create a new notification
  const createNotification = async ({
    recipientId,
    type,
    title,
    message,
    link,
    metadata = {}
  }) => {
    if (!recipientId) {
      console.error('Recipient ID is required')
      return
    }
    
    // Don't notify yourself
    if (auth.currentUser && recipientId === auth.currentUser.uid) {
      return
    }
    
    try {
      await addDoc(collection(db, 'notifications'), {
        recipientId,
        type, // 'comment', 'like', 'follow', etc.
        title,
        message,
        link,
        metadata,
        read: false,
        createdAt: Timestamp.now()
      })
    } catch (err) {
      console.error('Error creating notification:', err)
      error.value = 'Could not create notification'
    }
  }
  
  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      const docRef = doc(db, 'notifications', notificationId)
      await updateDoc(docRef, { read: true })
    } catch (err) {
      console.error('Error marking notification as read:', err)
      error.value = 'Could not mark notification as read'
    }
  }
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!auth.currentUser) return
    
    try {
      const q = query(
        collection(db, 'notifications'),
        where('recipientId', '==', auth.currentUser.uid),
        where('read', '==', false)
      )
      
      const snapshot = await getDocs(q)
      const batch = writeBatch(db)
      
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true })
      })
      
      await batch.commit()
    } catch (err) {
      console.error('Error marking all as read:', err)
      error.value = 'Could not mark all as read'
    }
  }
  
  // Delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId))
    } catch (err) {
      console.error('Error deleting notification:', err)
      error.value = 'Could not delete notification'
    }
  }
  
  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!auth.currentUser) return
    
    try {
      const q = query(
        collection(db, 'notifications'),
        where('recipientId', '==', auth.currentUser.uid)
      )
      
      const snapshot = await getDocs(q)
      const batch = writeBatch(db)
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref)
      })
      
      await batch.commit()
    } catch (err) {
      console.error('Error clearing notifications:', err)
      error.value = 'Could not clear notifications'
    }
  }
  
  // Get time ago string
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return ''
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    
    return date.toLocaleDateString('default', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Grouped notifications by date
  const groupedNotifications = computed(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    }
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    notifications.value.forEach(notification => {
      const date = notification.createdAt?.toDate ? notification.createdAt.toDate() : new Date(notification.createdAt)
      
      if (date >= today) {
        groups.today.push(notification)
      } else if (date >= yesterday) {
        groups.yesterday.push(notification)
      } else if (date >= weekAgo) {
        groups.thisWeek.push(notification)
      } else {
        groups.older.push(notification)
      }
    })
    
    return groups
  })
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    groupedNotifications,
    startListening,
    stopListening,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getTimeAgo
  }
}
