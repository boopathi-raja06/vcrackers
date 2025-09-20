import { db } from "./initFirebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { validateOrder } from "./orderSchema";

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

// Orders with unified schema
export const getOrders = (callback) => {
  return onSnapshot(collection(db, "orders"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const addOrder = async (orderData) => {
  // Validate order data against unified schema
  const validation = validateOrder(orderData);
  
  if (!validation.isValid) {
    throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
  }
  
  try {
    const docRef = await addDoc(collection(db, "orders"), orderData);
    return { success: true, orderId: orderData.orderId, docId: docRef.id };
  } catch (error) {
    console.error('Error adding order:', error);
    throw new Error(`Failed to save order: ${error.message}`);
  }
};

export const updateOrderStatus = async (docId, newStatus) => {
  // Validate status
  const validStatuses = ['Pending', 'Dispatched', 'Delivered'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Valid statuses are: ${validStatuses.join(', ')}`);
  }
  
  try {
    await updateDoc(doc(db, "orders", docId), { 
      status: newStatus,
      deliveryStatus: newStatus // Keep both fields in sync
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(`Failed to update order status: ${error.message}`);
  }
};

export const updateOrderTransport = async (docId, transport) => {
  try {
    await updateDoc(doc(db, "orders", docId), { 
      transport: transport || ''
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating order transport:', error);
    throw new Error(`Failed to update order transport: ${error.message}`);
  }
};

export const updateOrderType = async (docId, type) => {
  // Validate type
  const validTypes = ['TO-PAY', 'PAID'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid type: ${type}. Valid types are: ${validTypes.join(', ')}`);
  }
  
  try {
    await updateDoc(doc(db, "orders", docId), { 
      type: type
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating order type:', error);
    throw new Error(`Failed to update order type: ${error.message}`);
  }
};

// Get single order by document ID
export const getOrderById = async (docId) => {
  try {
    const orderDoc = await getDoc(doc(db, "orders", docId));
    if (orderDoc.exists()) {
      return { id: orderDoc.id, ...orderDoc.data() };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
};

// Gallery
export const getGallery = (callback) => {
  return onSnapshot(collection(db, "gallery"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};
