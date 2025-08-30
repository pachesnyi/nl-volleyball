import { collection, getDocs, limit, query, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export async function makeFirstUserAdmin() {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const firstUser = snapshot.docs[0];
      const userDoc = doc(db, 'users', firstUser.id);
      
      await updateDoc(userDoc, {
        role: 'admin',
        approvedAt: new Date().toISOString()
      });
      
      console.log('First user has been made admin:', firstUser.data().email);
      return true;
    } else {
      console.log('No users found in the database');
      return false;
    }
  } catch (error) {
    console.error('Error making first user admin:', error);
    return false;
  }
}