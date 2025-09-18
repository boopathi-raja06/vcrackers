import React from 'react';
// TODO: Fetch stats from Firestore
const stats = [
  { label: 'No. of Products', value: 0 },
  { label: 'Orders Received', value: 0 },
  { label: 'Orders Dispatched', value: 0 },
  { label: 'Orders Pending', value: 0 },
];
export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-red-700 mb-2">{stat.value}</span>
          <span className="font-semibold text-gray-700">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
