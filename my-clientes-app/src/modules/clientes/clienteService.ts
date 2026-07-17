import { db } from '../../firebase/firestore';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const clientesCollection = collection(db, 'clientes');

export const createCliente = async (clienteData) => {
    try {
        const docRef = await addDoc(clientesCollection, clienteData);
        return docRef.id;
    } catch (error) {
        console.error('Error adding document: ', error);
        throw error;
    }
};

export const getClientes = async () => {
    try {
        const querySnapshot = await getDocs(clientesCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting documents: ', error);
        throw error;
    }
};

export const searchClientes = async (nome) => {
    try {
        const q = query(clientesCollection, where('nome', '==', nome));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error searching documents: ', error);
        throw error;
    }
};

export const updateCliente = async (id, clienteData) => {
    try {
        const clienteRef = doc(db, 'clientes', id);
        await updateDoc(clienteRef, clienteData);
    } catch (error) {
        console.error('Error updating document: ', error);
        throw error;
    }
};

export const deleteCliente = async (id) => {
    try {
        const clienteRef = doc(db, 'clientes', id);
        await deleteDoc(clienteRef);
    } catch (error) {
        console.error('Error deleting document: ', error);
        throw error;
    }
};