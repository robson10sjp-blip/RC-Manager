import db from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const addProduct = async (productData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: any[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...docSnap.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting products: ', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, updatedData: any) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updatedData);
  } catch (error) {
    console.error('Error updating product: ', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product: ', error);
    throw error;
  }
};
