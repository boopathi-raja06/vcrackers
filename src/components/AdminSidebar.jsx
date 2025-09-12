import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="bg-gray-900 text-white w-48 min-h-screen p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      <Link to="/admin/products" className={`py-2 px-4 rounded ${pathname.includes("products") ? "bg-red-700" : "hover:bg-gray-800"}`}>Products</Link>
      <Link to="/admin/orders" className={`py-2 px-4 rounded ${pathname.includes("orders") ? "bg-red-700" : "hover:bg-gray-800"}`}>Orders</Link>
    </aside>
  );
};

export default AdminSidebar;
