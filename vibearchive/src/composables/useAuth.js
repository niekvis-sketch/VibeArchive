import { ref } from 'vue'
import { auth, db } from '../firebase/config'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

// Global state using closure pattern (similar to a store)
const user = ref(null)
const authIsReady = ref(false)

// Listener for auth changes
onAuthStateChanged(auth, (_user) => {
  user.value = _user
  authIsReady.value = true
})

export function useAuth() {
  const error = ref(null)
  const loading = ref(false)

  const signup = async (email, password, displayName) => {
    error.value = null
    loading.value = true
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      if (!res) {
        throw new Error('Could not complete signup')
      }
      
      // Update display name
      await updateProfile(res.user, { displayName })
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        displayName,
        email,
        createdAt: new Date(),
        publicProfile: true, // Default public
        photoURL: null,
        bio: ''
      })

      error.value = null
      return res
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    error.value = null
    loading.value = true
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      error.value = null
      return res
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    error.value = null
    try {
      await signOut(auth)
    } catch (err) {
      error.value = err.message
    }
  }

  return { 
    user, 
    error, 
    loading, 
    authIsReady,
    signup, 
    login, 
    logout 
  }
}
