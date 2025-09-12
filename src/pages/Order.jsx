import React, { useState } from 'react';
import CheckoutDrawer from '../components/CheckoutDrawer';
import OrderProductTable from '../components/OrderProductTable';

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Clear cart after successful order
  const handleDrawerClose = (orderPlaced = false) => {
    setDrawerOpen(false);
    if (orderPlaced) setCartItems([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Estimate / Order</h1>
      <OrderProductTable cartItems={cartItems} setCartItems={setCartItems} />
      <button
        className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800"
        onClick={() => setDrawerOpen(true)}
        disabled={cartItems.length === 0}
      >
        Place Order
      </button>
      <CheckoutDrawer
        open={drawerOpen}
        onClose={() => handleDrawerClose(false)}
        cartItems={cartItems}
        onOrderPlaced={() => handleDrawerClose(true)}
      />
      <p className="mt-6 text-gray-700">For bulk orders and special requests, please contact us directly.</p>
      <footer className="bg-gray-900 text-gray-100 w-full py-6 mt-8 rounded-lg">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="font-bold text-lg mb-2">Veena Crackers</h3>
          <p className="mb-2">123 Main Street, Sivakasi | Phone: +91-9876543210 | Email: info@veenacrackers.in</p>
          <p className="text-xs">Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Order;
