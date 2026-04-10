import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../firebase';

export const firebaseService = {
  subscribe: (collectionName, callback, sortField = 'createdAt') => {
    // Query without orderBy because Firestore orderBy completely filters out 
    // any documents that do not have the 'sortField' (like manually created docs)
    const q = query(collection(db, collectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort locally to ensure we still get all documents even if some are missing the sort field
      data.sort((a, b) => {
        const valA = a[sortField]?.toDate ? a[sortField].toDate().getTime() : new Date(a[sortField] || 0).getTime();
        const valB = b[sortField]?.toDate ? b[sortField].toDate().getTime() : new Date(b[sortField] || 0).getTime();
        return valB - valA; // Descending
      });
      
      callback(data);
    }, (error) => {
      console.error(`Error subscribing to ${collectionName}:`, error);
      callback([]); 
    });

    return unsubscribe;
  },

  getOne: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  },

  create: async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data, createdAt: new Date() }; // returning approximate representation
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  },

  update: async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { id, ...data };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  },

  delete: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  },

  getCount: async (collectionName) => {
    try {
      const coll = collection(db, collectionName);
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (error) {
      console.error(`Error getting count for ${collectionName}:`, error);
      return 0;
    }
  }
};
