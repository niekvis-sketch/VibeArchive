import { ref } from 'vue'
import { auth, db, storage } from '../firebase/config'
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export function useUserProfile() {
  const loading = ref(false)
  const error = ref(null)

  const getAllUsers = async () => {
    loading.value = true
    error.value = null
    try {
        const querySnapshot = await getDocs(collection(db, 'users'))
        const users = []
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() })
        })
        return users
    } catch (err) {
        error.value = err.message
        return []
    } finally {
        loading.value = false
    }
  }

  const getUserProfile = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        // Create basic profile if not exists
        const user = auth.currentUser
        const newProfile = {
            displayName: user?.displayName || 'User',
            email: user?.email,
            createdAt: new Date(),
            photoURL: user?.photoURL || null,
            bio: '',
            username: '',
            settings: {
                privacy: {
                    profilePublic: true,
                    showEmail: false,
                    showStats: true,
                    defaultProjectVisibility: 'vis_public'
                },
                preferences: {
                    theme: 'dark',
                    accentColor: '#6366f1',
                    compactView: false,
                    language: 'en',
                    timezone: 'UTC',
                    dateFormat: 'DD-MM-YYYY'
                }
            },
            stats: {
                totalProjects: 0,
                totalComments: 0,
                storageUsedMB: 0
            }
        }
        await setDoc(docRef, newProfile)
        return newProfile
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUserProfile = async (userId, data, photoFile) => {
    loading.value = true
    error.value = null
    
    try {
      let updateData = { ...data }
      
      // Handle photo upload
      if (photoFile) {
        // Create a unique filename
        const fileExt = photoFile.name.split('.').pop()
        const filePath = `avatars/${userId}/${Date.now()}.${fileExt}`
        const fileRef = storageRef(storage, filePath)
        
        await uploadBytes(fileRef, photoFile)
        const photoURL = await getDownloadURL(fileRef)
        
        updateData.photoURL = photoURL
        
        // Update Auth Profile as well for header consistency
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { photoURL })
        }
      }

      // Update Auth Display Name if changed
      if (data.displayName && auth.currentUser && data.displayName !== auth.currentUser.displayName) {
          await updateProfile(auth.currentUser, { displayName: data.displayName })
      }

      const docRef = doc(db, 'users', userId)
      await updateDoc(docRef, updateData)
      
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { getUserProfile, updateUserProfile, getAllUsers, loading, error }
}
