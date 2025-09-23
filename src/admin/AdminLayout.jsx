import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout() {
  const options = [
    { 
      name: 'Products', 
      path: '/admin/products',
      icon: '📦',
      gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
      hoverGradient: 'hover:from-blue-500 hover:to-blue-700',
      textColor: 'text-white'
    },
    { 
      name: 'Orders', 
      path: '/admin/orders',
      icon: '📋',
      gradient: 'bg-gradient-to-br from-green-400 to-green-600',
      hoverGradient: 'hover:from-green-500 hover:to-green-700',
      textColor: 'text-white'
    },
    { 
      name: 'Offers', 
      path: '/admin/offers',
      icon: '🎁',
      gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
      hoverGradient: 'hover:from-purple-500 hover:to-purple-700',
      textColor: 'text-white'
    },
    { 
      name: 'Contact', 
      path: '/admin/contact',
      icon: '📞',
      gradient: 'bg-gradient-to-br from-orange-400 to-orange-600',
      hoverGradient: 'hover:from-orange-500 hover:to-orange-700',
      textColor: 'text-white'
    },
    { 
      name: 'Banner Settings', 
      path: '/admin/banners',
      icon: '🖼️',
      gradient: 'bg-gradient-to-br from-pink-400 to-pink-600',
      hoverGradient: 'hover:from-pink-500 hover:to-pink-700',
      textColor: 'text-white'
    },
    { 
      name: 'General', 
      path: '/admin/general',
      icon: '⚙️',
      gradient: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      hoverGradient: 'hover:from-indigo-500 hover:to-indigo-700',
      textColor: 'text-white'
    },
    { 
      name: 'Video', 
      path: '/admin/dashboard/video',
      icon: '🎥',
      gradient: 'bg-gradient-to-br from-red-400 to-red-600',
      hoverGradient: 'hover:from-red-500 hover:to-red-700',
      textColor: 'text-white'
    },
    { 
      name: 'Pricelist', 
      path: '/admin/dashboard/pricelist',
      icon: '💰',
      gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      hoverGradient: 'hover:from-yellow-500 hover:to-yellow-700',
      textColor: 'text-white'
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-4">
          Veena Crackers Admin
        </h1>
        <p className="text-gray-600 text-lg">Manage your cracker shop with ease</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {options.map((opt, index) => (
          <button
            key={opt.name}
            onClick={() => navigate(opt.path)}
            className={`${opt.gradient} ${opt.hoverGradient} rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer w-full transform hover:scale-105 hover:shadow-2xl`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: `${index * 150}ms` }}>
              {opt.icon}
            </div>
            <span className={`text-xl font-bold ${opt.textColor} mb-2 drop-shadow-lg`}>
              {opt.name}
            </span>
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </button>
        ))}
      </div>
      
      <div className="w-full max-w-6xl mt-16">
        <Outlet />
      </div>
    </div>
  );
}
