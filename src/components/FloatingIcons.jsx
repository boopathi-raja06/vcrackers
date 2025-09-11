import React from "react";

const FloatingIcons = () => (
  <div className="fixed left-4 bottom-16 flex flex-col gap-4 z-50">
    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 13.487a4.5 4.5 0 01-6.349-6.349m6.349 6.349l2.122 2.122m-2.122-2.122l-2.122-2.122" />
      </svg>
    </a>
    <a href="tel:+919876543210" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6.75z" />
      </svg>
    </a>
  </div>
);

export default FloatingIcons;
