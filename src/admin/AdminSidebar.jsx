import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// TODO: Add Heroicons/Lucide icons
const links = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Orders', path: '/admin/orders' },
  { name: 'Offers', path: '/admin/offers' },
  { name: 'Payment', path: '/admin/payment' },
  { name: 'Contact', path: '/admin/contact' },
  { name: 'Banner', path: '/admin/banner' },
  { name: 'General', path: '/admin/general' },
  { name: 'Video', path: '/admin/video' },
  { name: 'Pricelist', path: '/admin/pricelist' },
];
export default function AdminSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="bg-gray-900 text-white w-56 min-h-screen p-4 flex flex-col gap-2">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      {links.map(link => (
        <Link key={link.name} to={link.path} className={`py-2 px-4 rounded flex items-center gap-2 ${pathname.includes(link.path.split('/').pop()) ? 'bg-red-700' : 'hover:bg-gray-800'}`}>{link.name}</Link>
      ))}
    </aside>
  );
}
