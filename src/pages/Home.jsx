import React, { useState, useEffect } from 'react';
import { SlideInTop, SlideInLeft, SlideInRight, SlideInBottom, StaggeredSlideInBottom } from '../components/MotionWrappers';
import ProductList from '../components/ProductList';
import { getOffers, getContact, getBanners } from '../firebase/firestoreService';
import { useColors } from '../contexts/ColorProvider';

import diwaliBanner from '../assets/banner2.jpg';

const specialties = [
  { name: 'Chakkars', icon: '🌀' },
  { name: 'Flower Pots', icon: '🌺' },
  { name: 'Sparklers & Pencils', icon: '✨' },
  { name: 'Single Shots', icon: '💥' },
  { name: 'Garlands', icon: '🎉' },
  { name: 'Rockets', icon: '🚀' },
  { name: 'Atom Bombs', icon: '💣' },
  { name: 'Fountain Crackers', icon: '⛲' },
];

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [contactData, setContactData] = useState({
    phone: "+91-9876543210",
    email: "info@veenacrackers.in"
  });
  const [banners, setBanners] = useState({
    homePage: diwaliBanner
  });
  
  const { getColorStyles } = useColors();
  const newsStyle = getColorStyles().news;
  const itemGroupStyle = getColorStyles().itemGroup;

  useEffect(() => {
    const unsubscribeOffers = getOffers((offersData) => {
      setOffers(offersData);
      setOffersLoading(false);
    });

    const unsubscribeContact = getContact((data) => {
      setContactData(data);
    });

    const unsubscribeBanners = getBanners((data) => {
      setBanners(data);
    });

    return () => {
      unsubscribeOffers();
      unsubscribeContact();
      unsubscribeBanners();
    };
  }, []);
  return (
    <>
      {/* Dedicated Banner Section */}
      <div className="w-full flex justify-center py-4 bg-gray-50">
        <div className="w-4/5 h-80 md:h-96 lg:h-[500px] rounded-lg shadow-lg overflow-hidden bg-white">
          <SlideInTop>
            <img 
              src={banners.homePage || diwaliBanner} 
              alt="Home Banner" 
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = diwaliBanner;
              }}
            />
          </SlideInTop>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center px-4 py-8">
      <SlideInLeft>
        <h1 className="text-4xl font-bold text-red-700 mb-2">Welcome to Veena Crackers</h1>
      </SlideInLeft>
      <SlideInBottom>
        <p className="text-lg mb-4 text-gray-700">Your one-stop shop for all types of crackers. Quality, safety, and celebration guaranteed!</p>
      </SlideInBottom>
      
      {/* Dynamic Offers Section */}
      {!offersLoading && offers.length > 0 && (
        <SlideInBottom>
          <div className="w-full max-w-4xl mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Special Offers</h2>
            <div className="grid gap-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border-l-4 border-yellow-500 p-4 rounded-lg shadow-md" style={newsStyle}>
                  <div className="flex items-center gap-3">
                    {offer.offerIcon && (
                      <div className="w-8 h-8 flex-shrink-0">
                        <img
                          src={offer.offerIcon}
                          alt="Offer icon"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg" style={{ color: newsStyle.color }}>{offer.offerTitle}</h3>
                      <p style={{ color: newsStyle.color }}>{offer.offerDescription}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <span className="text-red-700 font-semibold">Call: {contactData.phone}</span>
            </div>
          </div>
        </SlideInBottom>
      )}
      
      {/* Fallback offer if no dynamic offers */}
      {!offersLoading && offers.length === 0 && (
        <SlideInBottom>
          <div className="border-l-4 border-yellow-500 p-4 mb-6 w-full max-w-2xl text-center font-semibold" style={newsStyle}>
            Special Offer: Get up to 30% off on Diwali orders! Call: <span className="text-red-700">{contactData.phone}</span>
          </div>
        </SlideInBottom>
      )}
      <SlideInLeft>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Specialties</h2>
      </SlideInLeft>
      <StaggeredSlideInBottom>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl mx-auto mb-8">
          {specialties.map((item) => (
            <div key={item.name} className="flex flex-col items-center rounded-lg shadow p-4" style={itemGroupStyle}>
              <span className="text-4xl mb-2">{item.icon}</span>
              <span className="font-semibold" style={{ color: itemGroupStyle.color }}>{item.name}</span>
            </div>
          ))}
        </div>
      </StaggeredSlideInBottom>
      <SlideInLeft>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
      </SlideInLeft>
      <SlideInBottom>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 mb-6 w-full max-w-2xl text-center text-yellow-800 font-semibold">
          We provide all top branded deepavali crackers & other occasional Fire crackers retails and wholesale. We build your surprising occasion with lighting and sensational Gift box with our inspiring crackers. We provide all top branded deepavali crackers & other occasional Fire crackers retails and wholesale.
        </div>
      </SlideInBottom>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto mb-8">
        <SlideInLeft>
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-green-700 mb-4">Attractive</h3>
            <p className="text-gray-700">Secure and innovative packaging of Crackers.</p>
          </div>
        </SlideInLeft>
        <SlideInRight>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Manufacturing</h3>
            <p className="text-gray-700">It is made from the finest raw materials.</p>
          </div>
        </SlideInRight>
        <SlideInLeft>
          <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-pink-700 mb-4">Colourful</h3>
            <p className="text-gray-700">Our Crackers produce more colour and less smoke.</p>
          </div>
        </SlideInLeft>
        <SlideInRight>
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-red-700 mb-4">Safety</h3>
            <p className="text-gray-700">100% safe Crackers for childrens to use.</p>
          </div>
        </SlideInRight>
        <SlideInLeft>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-yellow-700 mb-4">Genuine Price</h3>
            <p className="text-gray-700">We can supply crackers at genuine price.</p>
          </div>
        </SlideInLeft>
        <SlideInRight>
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-green-700 mb-4">Satisfaction</h3>
            <p className="text-gray-700">We Guarantee you that your full hearted pure satisfaction.</p>
          </div>
        </SlideInRight>
      </div>
      <SlideInBottom>
        <footer className="bg-gray-900 text-gray-100 w-full h-[30vh] flex items-center justify-center mt-8 rounded-lg">
          <div className="mx-auto px-4 text-center">
            <h3 className="font-bold text-2xl mb-4">Veena Crackers</h3>
            <p className="mb-4 text-lg">123 Main Street, Sivakasi | Phone: {contactData.phone} | Email: {contactData.email}</p>
            <p className="text-base">Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.</p>
          </div>
        </footer>
      </SlideInBottom>
      </div>
    </>
  );
};

export default Home;
