import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductManager from '../components/ProductManager';
import OrderManager from '../components/OrderManager';
import AdminProductForm from '../components/AdminProductForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Admin Dashboard</h1>
      <AdminProductForm />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductManager />
        <OrderManager />
      </div>
  {/* Only use AdminProductForm for product creation */}
    </div>
  );
};

export default AdminDashboard;
