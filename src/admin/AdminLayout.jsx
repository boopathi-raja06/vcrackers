import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout() {
  const options = [
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Offers', path: '/admin/offers' },
    { name: 'Contact', path: '/admin/contact' },
    { name: 'Banner Settings', path: '/admin/banners' },
    { name: 'General', path: '/admin/dashboard/general' },
    { name: 'Video', path: '/admin/dashboard/video' },
    { name: 'Pricelist', path: '/admin/dashboard/pricelist' },
  ];
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-red-700 mb-10 text-center">Veena Crackers Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        {options.map(opt => (
          <button
            key={opt.name}
            onClick={() => navigate(opt.path)}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center hover:bg-red-50 transition cursor-pointer w-full"
          >
            {/* TODO: Add icon here if needed */}
            <span className="text-xl font-bold text-gray-800 mb-2">{opt.name}</span>
          </button>
        ))}
      </div>
      <div className="w-full max-w-5xl mt-12">
        <Outlet />
      </div>
    </div>
  );
}
