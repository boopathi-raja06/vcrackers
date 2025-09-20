import { db } from "./initFirebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

// Products
export const getProducts = (callback) => {
  return onSnapshot(collection(db, "products"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const addProduct = async (product) => {
  await addDoc(collection(db, "products"), product);
};

export const updateProduct = async (id, product) => {
  await updateDoc(doc(db, "products", id), product);
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, "products", id));
};

// Orders
export const getOrders = (callback) => {
  return onSnapshot(collection(db, "orders"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const addOrder = async (order) => {
  await addDoc(collection(db, "orders"), order);
};

export const updateOrderStatus = async (orderId, status) => {
  await updateDoc(doc(db, "orders", orderId), { status });
};

// Gallery
export const getGallery = (callback) => {
  return onSnapshot(collection(db, "gallery"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};
