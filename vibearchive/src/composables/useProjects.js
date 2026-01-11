import { ref } from 'vue';
import { db, auth } from '../firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';

export function useProjects() {
    const error = ref(null);
    const loading = ref(false);

    const getProject = async (id) => {
        error.value = null;
        loading.value = true;
        try {
            const docRef = doc(db, 'projects', id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { ...docSnap.data(), id: docSnap.id };
            } else {
                error.value = "Project not found";
                return null;
            }
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateProject = async (id, projectData, imageFile) => {
         error.value = null;
         loading.value = true;
         try {
             let dataToUpdate = { ...projectData, updatedAt: new Date() };

             // Handle image if provided
             if (imageFile) {
                 const imageUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
                dataToUpdate.imageUrl = imageUrl;
             }

             const docRef = doc(db, 'projects', id);
             await updateDoc(docRef, dataToUpdate);
         } catch (err) {
             error.value = err.message;
             throw err;
         } finally {
             loading.value = false;
         }
    };

    const addProject = async (projectData, imageFile) => {
        error.value = null;
        loading.value = true;
        
        try {
            if (!auth.currentUser) {
                throw new Error("You must be logged in to add a project");
            }

            let imageUrl = '';

            // 1. Convert Image to Base64 String if it exists
            if (imageFile) {
                console.log("Processing image...");
                imageUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            }

            // 2. Add to Firestore
            console.log("Adding project to Firestore...");
            const docRef = await addDoc(collection(db, 'projects'), {
                ...projectData,
                imageUrl, // Save the image string directly in the document
                userId: auth.currentUser.uid, // Add User ID
                createdAt: new Date()
            });
            console.log("Document written with ID: ", docRef.id);
            return docRef;

        } catch (err) {
            console.error("Error in addProject:", err);
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const getProjects = async () => {
        error.value = null;
        loading.value = true;
        try {
            let q;
            if (auth.currentUser) {
                 q = query(collection(db, 'projects'), where('userId', '==', auth.currentUser.uid));
            } else {
                // If not logged in, maybe return public projects? Or empty?
                // For now, let's return empty or handle in component
                return [];
            }

            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push({ ...doc.data(), id: doc.id });
            });
            return results;
        } catch (err) {
            error.value = err.message;
            console.error(err);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const deleteProject = async (id) => {
        error.value = null;
        loading.value = true;
        try {
            await deleteDoc(doc(db, 'projects', id));
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { addProject, getProjects, getProject, updateProject, deleteProject, error, loading };
}
