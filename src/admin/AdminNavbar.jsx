import React from 'react';
// TODO: Add profile dropdown, search, shop name from Firestore
export default function AdminNavbar() {
  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-3">
      <span className="font-bold text-xl text-red-700">Veena Crackers</span>
      <input type="text" placeholder="Search..." className="border rounded px-3 py-1" />
      <div className="flex items-center gap-4">
        <span className="font-semibold">Admin</span>
        {/* Profile dropdown TODO */}
      </div>
    </nav>
  );
}
