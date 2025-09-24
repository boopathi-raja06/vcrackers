import React, { useState, useEffect } from 'react';
import { SlideInTop, SlideInLeft, SlideInRight, SlideInBottom } from '../components/MotionWrappers';
import { getBanners } from '../firebase/firestoreService';
import FloatingIcons from '../components/FloatingIcons';
import { AmbientCrackersAnimation, FireworkTrails } from '../components/CrackersAnimation';
import banner from '../assets/banner2.jpg';

const brands = [
  { name: 'Vadivel', logo: '🟦' },
  { name: 'Supreme', logo: '🟥' },
  { name: 'Starvell', logo: '⭐' },
];

const AboutUs = () => {
  const [banners, setBanners] = useState({
    aboutUs: banner
  });

  useEffect(() => {
    const unsubscribe = getBanners((data) => {
      setBanners(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Beautiful Crackers Animations */}
      <AmbientCrackersAnimation />
      <FireworkTrails isActive={true} />
      
      {/* Dedicated Banner Section - Mobile Responsive */}
      <div className="w-full flex justify-center py-2 sm:py-4 bg-gray-50">
        <div className="w-[95%] sm:w-[90%] md:w-4/5 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-md sm:rounded-lg shadow-lg overflow-hidden bg-white">
          <SlideInTop>
            <img 
            src={banners.aboutUs || banner} 
            alt="About Us Banner" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = banner;
            }}
          />
          </SlideInTop>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center px-4 py-8">
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
      
      {/* Floating action buttons */}
      <FloatingIcons />
    </>
  );
};

export default AboutUs;
