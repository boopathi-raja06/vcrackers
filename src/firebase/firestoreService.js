import { db, storage } from "./initFirebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  setDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
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

export const deleteOrder = async (docId) => {
  try {
    await deleteDoc(doc(db, "orders", docId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error(`Failed to delete order: ${error.message}`);
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

// Offers
export const getOffers = (callback) => {
  return onSnapshot(collection(db, "offers"), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const addOffer = async (offer) => {
  try {
    const docRef = await addDoc(collection(db, "offers"), {
      ...offer,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding offer:', error);
    throw new Error(`Failed to add offer: ${error.message}`);
  }
};

export const deleteOffer = async (id) => {
  try {
    await deleteDoc(doc(db, "offers", id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw new Error(`Failed to delete offer: ${error.message}`);
  }
};

// Contact
export const getContact = (callback) => {
  return onSnapshot(doc(db, "contact", "info"), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      // Return default contact info if document doesn't exist
      callback({
        phone: "+91-9876543210",
        whatsapp: "+91-9876543210",
        email: "info@veenacrackers.in"
      });
    }
  });
};

export const updateContact = async (contactData) => {
  try {
    await updateDoc(doc(db, "contact", "info"), {
      ...contactData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error(`Failed to update contact: ${error.message}`);
  }
};

// Banners
// Note: Make sure Firebase Storage rules allow read/write access:
// rules_version = '2';
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if true;
//     }
//   }
// }
export const getBanners = (callback) => {
  return onSnapshot(doc(db, "banners", "settings"), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      // Return default banner info if document doesn't exist - using import paths
      callback({
        aboutUs: "",
        contactUs: "",
        orderPage: "",
        giftbox: "",
        gallery: "",
        homePage: ""
      });
    }
  });
};

export const uploadBannerImage = async (file, bannerType) => {
  try {
    // Create a more unique filename to avoid conflicts
    const fileExtension = file.name.split('.').pop();
    const fileName = `${bannerType}_${Date.now()}.${fileExtension}`;
    
    // Create a reference to the banner image in storage
    const storageRef = ref(storage, `banners/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading banner image:', error);
    throw new Error(`Failed to upload banner image: ${error.message}`);
  }
};

export const updateBanners = async (bannerData) => {
  try {
    await setDoc(doc(db, "banners", "settings"), {
      ...bannerData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating banners:', error);
    throw new Error(`Failed to update banners: ${error.message}`);
  }
};

export const updateSingleBanner = async (bannerType, imageURL) => {
  try {
    await updateDoc(doc(db, "banners", "settings"), {
      [bannerType]: imageURL,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating single banner:', error);
    throw new Error(`Failed to update ${bannerType} banner: ${error.message}`);
  }
};
