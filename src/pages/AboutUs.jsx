import React from 'react';

import banner from '../assets/banner2.jpg';

const brands = [
  { name: 'Vadivel', logo: '🟦' },
  { name: 'Supreme', logo: '🟥' },
  { name: 'Starvell', logo: '⭐' },
];

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center px-4 py-8">
  <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-lg shadow mb-6 overflow-hidden flex items-center justify-center">
        <img src={banner} alt="Happy Diwali Banner" className="w-full h-full object-cover" />
      </div>
      <h1 className="text-3xl font-bold text-red-700 mb-4">About Us</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Veena Crackers is a trusted name in the fireworks industry, known for quality products and customer satisfaction. We offer a wide range of crackers for all occasions, ensuring safety and joy in every celebration. Our team is dedicated to providing the best service and products to our valued customers.
      </p>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Brands</h2>
      <div className="flex gap-8 mb-8">
        {brands.map((brand) => (
          <div key={brand.name} className="flex flex-col items-center">
            <span className="text-5xl mb-2">{brand.logo}</span>
            <span className="font-semibold text-gray-700">{brand.name}</span>
          </div>
        ))}
      </div>
      <footer className="bg-gray-900 text-gray-100 w-full h-[30vh] flex items-center justify-center mt-8 rounded-lg">
        <div className="mx-auto px-4 text-center">
          <h3 className="font-bold text-2xl mb-4">Veena Crackers</h3>
          <p className="mb-4 text-lg">123 Main Street, Sivakasi | Phone: +91-9876543210 | Email: info@veenacrackers.in</p>
          <p className="text-base">Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
