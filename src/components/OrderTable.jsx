import React from 'react';

const OrderTable = ({ orders }) => (
  <table className="min-w-full border rounded">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2">Customer</th>
        <th className="p-2">Email</th>
        <th className="p-2">Products</th>
        <th className="p-2">Total</th>
      </tr>
    </thead>
    <tbody>
      {orders.map(order => (
        <tr key={order.id} className="border-t">
          <td className="p-2">{order.customerName}</td>
          <td className="p-2">{order.customerEmail}</td>
          <td className="p-2">{order.products?.map(p => p.name).join(', ')}</td>
          <td className="p-2">₹{order.total}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OrderTable;
