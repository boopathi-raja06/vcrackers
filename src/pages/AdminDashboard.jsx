import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Routes, Route } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

const AdminDashboard = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);


  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">
        <Routes>
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
