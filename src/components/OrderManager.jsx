import React, { useState } from 'react';

const initialOrders = JSON.parse(localStorage.getItem('orders') || '[]');

const OrderManager = () => {
  const [orders] = useState(initialOrders);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Orders Management</h2>
      <div className="mb-2">Total Orders: {orders.length}</div>
      <div className="mb-2">Total Revenue: ₹{totalRevenue}</div>
      <ul className="divide-y">
        {orders.map(o => (
          <li key={o.id} className="py-2">
            <div className="font-semibold">{o.customerName} ({o.customerEmail})</div>
            <div>Products: {o.products?.map(p => p.name).join(', ')}</div>
            <div>Total: ₹{o.total}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManager;
