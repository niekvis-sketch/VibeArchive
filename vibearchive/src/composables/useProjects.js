import { ref } from 'vue';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

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
            const querySnapshot = await getDocs(collection(db, 'projects'));
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
