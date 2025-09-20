import React, { useState } from "react";
import { addOrder } from "../firebase/firestoreService";
import { createOrderObject } from "../firebase/orderSchema";

export default function CheckoutDrawer({ open, onClose, cartItems, onOrderPlaced }) {
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    address: "", 
    email: "",
    place: ""
  });
  const [discount, setDiscount] = useState(0); // Add discount state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Calculate totals using unified schema approach
  const subtotal = cartItems.reduce((sum, item) => {
    const quantity = item.qty || item.quantity || 1;
    const price = item.price || item.unitPrice || 0;
    return sum + (quantity * price);
  }, 0);
  
  // Calculate total after discount
  const total = Math.max(0, subtotal - discount);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name || !form.phone.match(/^[0-9]{10}$/) || !form.email) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Debug logging
      console.log('Order creation - discount value:', discount);
      console.log('Order creation - subtotal:', subtotal);
      console.log('Order creation - total after discount:', total);
      
      // Create unified order object using schema
      const orderData = createOrderObject(
        {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          place: form.place
        },
        cartItems,
        {
          discount: discount, // Use actual discount value
          transport: '', // Can be set later by admin
          type: 'TO-PAY', // Default payment type
          status: 'Pending' // Initial status
        }
      );

      // Debug logging for order data
      console.log('Created order data:', orderData);
      console.log('Order discount field:', orderData.discount);

      // Add order to Firestore
      const result = await addOrder(orderData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setForm({ name: "", phone: "", address: "", email: "", place: "" });
          setDiscount(0); // Reset discount
          if (onOrderPlaced) onOrderPlaced();
          else onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Checkout</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          
          <form className="flex-1 p-6 overflow-y-auto" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Customer Details */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Customer Details</h3>
                <div className="space-y-3">
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Full Name *" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                  />
                  <input 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="Phone Number (10 digits) *" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                    maxLength={10} 
                    pattern="[0-9]{10}" 
                  />
                  <input 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="Email Address *" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                    type="email" 
                  />
                  <input 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange} 
                    placeholder="Full Address" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                  />
                  <input 
                    name="place" 
                    value={form.place} 
                    onChange={handleChange} 
                    placeholder="City/Place" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 mb-3">
                    {cartItems.map(item => {
                      const quantity = item.qty || item.quantity || 1;
                      const price = item.price || item.unitPrice || 0;
                      return (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <span className="flex-1">{item.name}</span>
                          <span className="mx-2 text-gray-600">x {quantity}</span>
                          <span className="font-medium">₹{(price * quantity).toLocaleString()}</span>
                        </li>
                      );
                    })}
                  </ul>
                  
                  {/* Discount Input */}
                  <div className="mb-3 pt-3 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Amount (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        max={subtotal}
                        step="0.01"
                        value={discount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setDiscount(Math.max(0, Math.min(subtotal, value)));
                        }}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Discount:</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-red-600">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-red-700 text-sm">{error}</div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-green-700 text-sm">
                    🎉 Order placed successfully! You will receive a confirmation shortly.
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Submit Button */}
          <div className="flex-shrink-0 p-6 border-t bg-gray-50">
            <button 
              type="submit" 
              onClick={handleSubmit}
              disabled={loading || success} 
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Placing Order...</span>
                </div>
              ) : success ? 'Order Placed!' : `Place Order - ₹${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}