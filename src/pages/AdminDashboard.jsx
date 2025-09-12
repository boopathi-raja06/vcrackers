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
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded w-full" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded w-full" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="p-2 border rounded w-full" required />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded w-full" required />
        <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded w-full">Add Product</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
