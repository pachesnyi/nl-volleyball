import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { User, UserRole } from '@/types';

export async function updateUserRole(userId: string, role: UserRole) {
  const userDoc = doc(db, 'users', userId);
  await updateDoc(userDoc, { 
    role,
    ...(role !== 'guest' ? { approvedAt: new Date().toISOString() } : {})
  });
}

export async function getAllUsers(): Promise<User[]> {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    approvedAt: doc.data().approvedAt?.toDate() || undefined
  })) as User[];
}

export async function getPendingUsers(): Promise<User[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', 'guest'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    approvedAt: doc.data().approvedAt?.toDate() || undefined
  })) as User[];
}