import React, { useState, useEffect } from 'react';
import { SlideInTop, SlideInLeft, SlideInRight, SlideInBottom } from '../components/MotionWrappers';
import { getBanners } from '../firebase/firestoreService';
import CheckoutDrawer from '../components/CheckoutDrawer';
import OrderProductTable from '../components/OrderProductTable';
import FloatingIcons from '../components/FloatingIcons';
import { AmbientCrackersAnimation, FireworkTrails } from '../components/CrackersAnimation';

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [banners, setBanners] = useState({
    orderPage: '/images/banners/order-banner.jpg'
  });

  useEffect(() => {
    const unsubscribe = getBanners((data) => {
      setBanners(data);
    });

    return () => unsubscribe();
  }, []);

  // Clear cart after successful order
  const handleDrawerClose = (orderPlaced = false) => {
    setDrawerOpen(false);
    if (orderPlaced) setCartItems([]);
  };

  return (
    <>
      {/* Beautiful Crackers Animations */}
      <AmbientCrackersAnimation />
      <FireworkTrails isActive={true} />
      
      {/* Dedicated Banner Section */}
            {/* Dedicated Banner Section - Mobile Responsive */}
      <div className="w-full flex justify-center py-2 sm:py-4 bg-gray-50">
        <div className="w-[95%] sm:w-[90%] md:w-4/5 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-md sm:rounded-lg shadow-lg overflow-hidden bg-white">
          <SlideInTop>
            <img 
            src={banners.orderPage || '/images/banners/order-banner.jpg'} 
            alt="Order Banner" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = '/images/banners/order-banner.jpg';
            }}
          />
          </SlideInTop>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center px-4 py-8">
      
      <div className="w-full p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Estimate / Order</h1>
      <OrderProductTable cartItems={cartItems} setCartItems={setCartItems} />
      <button
        className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800"
        onClick={() => setDrawerOpen(true)}
        disabled={cartItems.length === 0}
      >
        Place Order
      </button>
      <CheckoutDrawer
        open={drawerOpen}
        onClose={() => handleDrawerClose(false)}
        cartItems={cartItems}
        onOrderPlaced={() => handleDrawerClose(true)}
      />
      <p className="mt-6 text-gray-700">For bulk orders and special requests, please contact us directly.</p>
        <footer className="bg-gray-900 text-gray-100 w-full py-6 mt-8 rounded-lg">
          <div className="max-w-3xl mx-auto px-4">
            <h3 className="font-bold text-lg mb-2">Veena Crackers</h3>
            <p className="mb-2">123 Main Street, Sivakasi | Phone: +91-9876543210 | Email: info@veenacrackers.in</p>
            <p className="text-xs">Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.</p>
          </div>
        </footer>
      </div>
      </div>
      
      {/* Floating action buttons */}
      <FloatingIcons />
    </>
  );
};

export default Order;
