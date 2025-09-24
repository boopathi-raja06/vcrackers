import React, { useState, useEffect } from 'react';
import { SlideInTop, SlideInLeft, SlideInRight, SlideInBottom } from '../components/MotionWrappers';
import { getContact, getBanners } from '../firebase/firestoreService';
import FloatingIcons from '../components/FloatingIcons';
import { AmbientCrackersAnimation, FireworkTrails } from '../components/CrackersAnimation';
import banner from '../assets/banner2.jpg';

const Contact = () => {
  const [contactData, setContactData] = useState({
    phone: "+91-9876543210",
    whatsapp: "+91-9876543210", 
    email: "info@veenacrackers.in"
  });
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState({
    contactUs: banner
  });

  useEffect(() => {
    const unsubscribeContact = getContact((data) => {
      setContactData(data);
      setLoading(false);
    });

    const unsubscribeBanners = getBanners((data) => {
      setBanners(data);
    });

    return () => {
      unsubscribeContact();
      unsubscribeBanners();
    };
  }, []);
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
            src={banners.contactUs || banner} 
            alt="Contact Banner" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = banner;
            }}
          />
          </SlideInTop>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white mt-8 flex flex-col items-center">

      {/* Contact Box */}
      <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow flex flex-col items-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Contact Us</h1>

        <div className="mb-6 w-full">
          <iframe
            title="Veena Crackers Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.0000000000005!2d77.80000000000001!3d9.450000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVeena%20Crackers!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="mb-6 w-full text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 text-xl">📞</span>
              <div>
                <span className="font-bold text-gray-700">Phone:</span>
                <span className="ml-2 text-gray-600">{loading ? "Loading..." : contactData.phone}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">💬</span>
              <div>
                <span className="font-bold text-gray-700">WhatsApp:</span>
                <span className="ml-2 text-gray-600">{loading ? "Loading..." : contactData.whatsapp}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-xl">📧</span>
              <div>
                <span className="font-bold text-gray-700">Email:</span>
                <span className="ml-2 text-gray-600">{loading ? "Loading..." : contactData.email}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-orange-600 text-xl">📍</span>
              <div>
                <span className="font-bold text-gray-700">Address:</span>
                <span className="ml-2 text-gray-600">123 Main Street, Sivakasi</span>
              </div>
            </div>
          </div>
        </div>

        <form className="flex flex-col gap-4 w-full">
          <input type="text" placeholder="Your Name" className="p-2 border rounded" />
          <input type="email" placeholder="Your Email" className="p-2 border rounded" />
          <textarea placeholder="Your Message" rows={4} className="p-2 border rounded" />
          <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800">
            Send
          </button>
        </form>
      </div>

      {/* Footer - Full Width */}
      <footer className="bg-gray-900 text-gray-100 w-full h-[30vh] flex items-center justify-center mt-8">
        <div className="mx-auto px-4 text-center">
          <h3 className="font-bold text-2xl mb-4">Veena Crackers</h3>
          <p className="mb-4 text-lg">
            123 Main Street, Sivakasi | Phone: {loading ? "Loading..." : contactData.phone} | Email: {loading ? "Loading..." : contactData.email}
          </p>
          <p className="text-base">
            Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.
          </p>
        </div>
      </footer>
      </div>
      
      {/* Floating action buttons */}
      <FloatingIcons />
    </>
  );
};

export default Contact;
