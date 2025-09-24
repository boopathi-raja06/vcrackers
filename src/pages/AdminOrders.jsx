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
      <div className="overflow-x-auto mb-6">
        <table className="w-full border min-w-[800px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Customer</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Phone</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Address</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Email</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Total</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Date</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order.id}>
                <tr className="text-center">
                  <td className="border p-1 sm:p-2 text-xs sm:text-sm">{order.customerName}</td>
                  <td className="border p-1 sm:p-2 text-xs sm:text-sm">{order.phone}</td>
                  <td className="border p-1 sm:p-2 text-xs sm:text-sm max-w-[150px] truncate">{order.address || '-'}</td>
                  <td className="border p-1 sm:p-2 text-xs sm:text-sm max-w-[120px] truncate">{order.email}</td>
                  <td className="border p-1 sm:p-2 text-xs sm:text-sm font-semibold">₹{order.total}</td>
                  <td className="border p-1 sm:p-2 text-xs sm:text-sm">{order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleDateString() : (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-")}</td>
                  <td className="border p-1 sm:p-2">
                    <button className="text-blue-600 text-xs sm:text-sm px-1 sm:px-2 py-1 bg-blue-50 rounded hover:bg-blue-100" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
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
    </div>
  );
};

export default AdminOrders;
