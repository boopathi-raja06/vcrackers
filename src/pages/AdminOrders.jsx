import React, { useEffect, useState } from "react";
import { getOrders } from "../firebase/firestoreService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const unsubscribe = getOrders(setOrders);
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <React.Fragment key={order.id}>
              <tr className="text-center">
                <td className="border p-2">{order.customerName}</td>
                <td className="border p-2">{order.phone}</td>
                <td className="border p-2">{order.address || '-'}</td>
                <td className="border p-2">{order.email}</td>
                <td className="border p-2">₹{order.total}</td>
                <td className="border p-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</td>
                <td className="border p-2">
                  <button className="text-blue-600" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    {expanded === order.id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
              {expanded === order.id && (
                <tr>
                  <td colSpan={7} className="bg-gray-50 p-4">
                    <h3 className="font-bold mb-2">Ordered Items</h3>
                    <ul className="list-disc pl-6 mb-2">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>{item.name} (Qty: {item.qty}, Price: ₹{item.price})</li>
                      ))}
                    </ul>
                    <div><span className="font-semibold">Address:</span> {order.address || '-'}</div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
