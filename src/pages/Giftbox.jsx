import React, { useState, useEffect } from 'react';
import { getBanners } from '../firebase/firestoreService';
import banner from '../assets/banner2.jpg';

const giftBoxes = [
  { name: 'Diwali Special Box', price: '₹500', description: 'Complete festival package with assorted crackers' },
  { name: 'Family Fun Box', price: '₹300', description: 'Safe crackers perfect for family celebrations' },
  { name: 'Kids Special Box', price: '₹200', description: 'Child-friendly sparklers and fun crackers' },
  { name: 'Premium Gift Box', price: '₹1000', description: 'Luxury collection of premium crackers' },
];

const Giftbox = () => {
  const [banners, setBanners] = useState({
    giftbox: banner
  });

  useEffect(() => {
    const unsubscribe = getBanners((data) => {
      setBanners(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Dedicated Banner Section */}
      <div className="w-full flex justify-center py-4 bg-gray-50">
        <div className="w-4/5 h-80 md:h-96 lg:h-[500px] rounded-lg shadow-lg overflow-hidden bg-white">
          <img 
            src={banners.giftbox || banner} 
            alt="Giftbox Banner" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = banner;
            }}
          />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center px-4 py-8">

      <h1 className="text-3xl font-bold text-red-700 mb-4">Gift Boxes</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl text-center">
        Perfect gift boxes for your loved ones. Each box contains a curated selection of quality crackers for memorable celebrations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto mb-8">
        {giftBoxes.map((box, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-4">
              <span className="text-4xl">🎁</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{box.name}</h3>
            <p className="text-2xl font-bold text-red-700 mb-3 text-center">{box.price}</p>
            <p className="text-gray-600 text-center mb-4">{box.description}</p>
            <button className="w-full bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors">
              Contact for Details
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-100 w-full h-[30vh] flex items-center justify-center mt-8 rounded-lg">
        <div className="mx-auto px-4 text-center">
          <h3 className="font-bold text-2xl mb-4">Veena Crackers</h3>
          <p className="mb-4 text-lg">123 Main Street, Sivakasi | Phone: +91-9876543210 | Email: info@veenacrackers.in</p>
          <p className="text-base">Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.</p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Giftbox;
