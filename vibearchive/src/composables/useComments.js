import { ref } from 'vue'
import { db } from '../firebase/config'
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'

export function useComments(projectId) {
  const comments = ref([])
  const error = ref(null)

  // Collection reference
  let collectionRef = collection(db, 'projects', projectId, 'comments')
  const q = query(collectionRef, orderBy('createdAt', 'desc'))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    let results = []
    snapshot.docs.forEach(doc => {
      results.push({ ...doc.data(), id: doc.id })
    })
    
    // update values
    comments.value = results
    error.value = null
  }, (err) => {
    console.log(err.message)
    comments.value = []
    error.value = 'could not fetch comments'
  })

  const addComment = async (comment) => {
    error.value = null
    try {
      await addDoc(collectionRef, comment)
    } catch (err) {
      console.log(err.message)
      error.value = 'could not send the comment'
    }
  }

  const deleteComment = async (id) => {
    error.value = null
    try {
        const docRef = doc(db, 'projects', projectId, 'comments', id)
        await deleteDoc(docRef)
    } catch (err) {
        console.log(err.message)
        error.value = 'could not delete the comment'
    }
}

  return { error, comments, addComment, deleteComment, unsubscribe }
}
