import db from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const addClient = async (clientData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'clients'), clientData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding client: ', error);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'clients'));
    const clients: any[] = [];
    querySnapshot.forEach((docSnap) => {
      clients.push({ id: docSnap.id, ...docSnap.data() });
    });
    return clients;
  } catch (error) {
    console.error('Error getting clients: ', error);
    throw error;
  }
};

export const updateClient = async (clientId: string, updatedData: any) => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, updatedData);
  } catch (error) {
    console.error('Error updating client: ', error);
    throw error;
  }
};

export const deleteClient = async (clientId: string) => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await deleteDoc(clientRef);
  } catch (error) {
    console.error('Error deleting client: ', error);
    throw error;
  }
};
