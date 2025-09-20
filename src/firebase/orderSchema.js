import { serverTimestamp } from "firebase/firestore";

/**
 * Unified Order Schema for Veena Crackers
 * This schema is used by both client-side (CheckoutDrawer) and admin-side (OrdersPage)
 */

/**
 * Generates a unique order ID
 * Format: VEE-YYYYMMDD-HHMMSS-XXX (where XXX is random 3-digit number)
 */
export const generateOrderId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `VEE-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

/**
 * Validates and processes order items to ensure consistent structure
 * @param {Array} rawItems - Raw cart items from client
 * @returns {Array} - Processed items with unified schema
 */
export const processOrderItems = (rawItems) => {
  return rawItems.map(item => {
    // Handle different quantity field names (qty, quantity)
    const quantity = item.quantity || item.qty || 1;
    
    // Handle different price field names (price, unitPrice)
    const unitPrice = item.unitPrice || item.price || 0;
    
    // Calculate item-level discount (default 0)
    const discount = item.discount || 0;
    
    // Calculate final price per unit after discount
    const finalPrice = Math.max(0, unitPrice - discount);
    
    // Calculate total for this item
    const total = quantity * finalPrice;

    return {
      productId: item.id || item.productId || '',
      name: item.name || '',
      quantity: quantity,
      unitPrice: unitPrice,
      discount: discount,
      finalPrice: finalPrice,
      total: total
    };
  });
};

/**
 * Calculates order totals based on processed items
 * @param {Array} items - Processed order items
 * @param {number} overallDiscount - Overall order discount
 * @returns {Object} - Calculated totals
 */
export const calculateOrderTotals = (items, overallDiscount = 0) => {
  // Sum of all item totals (after item-level discounts)
  const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
  
  // Debug logging
  console.log('calculateOrderTotals - items:', items);
  console.log('calculateOrderTotals - total before discount:', total);
  console.log('calculateOrderTotals - overallDiscount:', overallDiscount);
  
  // Apply overall discount
  const netAmount = Math.max(0, total - overallDiscount);
  
  // For now, totalAmount is same as netAmount (can add taxes, shipping later)
  const totalAmount = netAmount;

  console.log('calculateOrderTotals - netAmount:', netAmount);
  console.log('calculateOrderTotals - totalAmount:', totalAmount);

  return {
    total,
    netAmount,
    totalAmount
  };
};

/**
 * Creates a unified order object from client data
 * @param {Object} clientData - Order data from checkout form
 * @param {Array} cartItems - Cart items from client
 * @param {Object} options - Additional options (discount, transport, type, etc.)
 * @returns {Object} - Unified order object ready for Firestore
 */
export const createOrderObject = (clientData, cartItems, options = {}) => {
  const orderId = generateOrderId();
  const processedItems = processOrderItems(cartItems);
  const overallDiscount = options.discount || 0;
  const totals = calculateOrderTotals(processedItems, overallDiscount);
  
  // Debug logging
  console.log('orderSchema - options.discount:', options.discount);
  console.log('orderSchema - overallDiscount:', overallDiscount);
  console.log('orderSchema - totals:', totals);
  
  // Calculate expected delivery date (default: 3 days from now)
  const deliveryDate = options.deliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  
  return {
    // Order identification
    orderId: orderId,
    
    // Customer information
    customerName: clientData.name || clientData.customerName || '',
    phone: clientData.phone || '',
    email: clientData.email || '',
    address: clientData.address || '',
    place: clientData.place || '',
    
    // Timestamps
    date: serverTimestamp(), // Order created time
    deliveryDate: deliveryDate, // Expected/actual delivery time
    
    // Status fields (using single status field for consistency)
    status: options.status || 'Pending',
    deliveryStatus: options.status || 'Pending', // Keep for backward compatibility
    
    // Order details
    transport: options.transport || '',
    type: options.type || 'TO-PAY', // TO-PAY or PAID
    
    // Financial calculations
    discount: overallDiscount, // Overall discount in Rs.
    total: totals.total, // Sum of all item prices before overall discount
    netAmount: totals.netAmount, // Total after applying discounts
    totalAmount: totals.totalAmount, // Grand total (same as netAmount for now)
    
    // Items array
    items: processedItems
  };
};

/**
 * Validates an order object against the unified schema
 * @param {Object} order - Order object to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateOrder = (order) => {
  const errors = [];
  
  // Required fields validation
  if (!order.orderId) errors.push('Order ID is required');
  if (!order.customerName) errors.push('Customer name is required');
  if (!order.phone || !/^[0-9]{10}$/.test(order.phone)) {
    errors.push('Valid 10-digit phone number is required');
  }
  if (!order.email || !/\S+@\S+\.\S+/.test(order.email)) {
    errors.push('Valid email address is required');
  }
  
  // Items validation
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('At least one item is required');
  } else {
    order.items.forEach((item, index) => {
      if (!item.productId) errors.push(`Item ${index + 1}: Product ID is required`);
      if (!item.name) errors.push(`Item ${index + 1}: Product name is required`);
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Valid quantity is required`);
      }
      if (item.unitPrice < 0) errors.push(`Item ${index + 1}: Unit price cannot be negative`);
    });
  }
  
  // Status validation
  const validStatuses = ['Pending', 'Dispatched', 'Delivered'];
  if (order.status && !validStatuses.includes(order.status)) {
    errors.push('Invalid status. Must be one of: Pending, Dispatched, Delivered');
  }
  
  // Type validation
  const validTypes = ['TO-PAY', 'PAID'];
  if (order.type && !validTypes.includes(order.type)) {
    errors.push('Invalid type. Must be either TO-PAY or PAID');
  }
  
  // Financial validation
  if (order.discount < 0) errors.push('Discount cannot be negative');
  if (order.total < 0) errors.push('Total cannot be negative');
  if (order.netAmount < 0) errors.push('Net amount cannot be negative');
  if (order.totalAmount < 0) errors.push('Total amount cannot be negative');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Status transition helper - defines valid status transitions
 */
export const getValidStatusTransitions = (currentStatus) => {
  const transitions = {
    'Pending': ['Dispatched'],
    'Dispatched': ['Delivered'],
    'Delivered': [] // No further transitions
  };
  
  return transitions[currentStatus] || ['Pending', 'Dispatched', 'Delivered'];
};

/**
 * Default order schema for reference
 */
export const ORDER_SCHEMA = {
  orderId: "string", // VEE-YYYYMMDD-HHMMSS-XXX
  customerName: "string",
  phone: "string", // 10 digits
  email: "string",
  address: "string",
  place: "string",
  date: "timestamp", // Order created time
  deliveryDate: "timestamp", // Expected/actual delivery time
  status: "string", // Pending, Dispatched, Delivered
  deliveryStatus: "string", // Same as status (for compatibility)
  transport: "string",
  type: "string", // TO-PAY, PAID
  discount: "number", // Overall discount in Rs.
  total: "number", // Sum before discount
  netAmount: "number", // After discounts
  totalAmount: "number", // Grand total
  items: [{
    productId: "string",
    name: "string",
    quantity: "number",
    unitPrice: "number",
    discount: "number",
    finalPrice: "number", // unitPrice - discount
    total: "number" // quantity * finalPrice
  }]
};
