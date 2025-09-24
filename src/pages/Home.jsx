import React, { useState, useEffect } from 'react';
import { SlideInTop, SlideInLeft, SlideInRight, SlideInBottom, StaggeredSlideInBottom } from '../components/MotionWrappers';
import ProductList from '../components/ProductList';
import FloatingIcons from '../components/FloatingIcons';
import { getOffers, getContact, getBanners } from '../firebase/firestoreService';
import { useColors } from '../contexts/ColorProvider';
import { AmbientCrackersAnimation, FireworkTrails } from '../components/CrackersAnimation';

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
    homePage: '/images/banners/home-banner.jpg'
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
      {/* Beautiful Crackers Animations */}
      <AmbientCrackersAnimation />
      <FireworkTrails isActive={true} />
      
      {/* Test animation indicator */}
      <div className="fixed top-4 right-4 z-40 bg-red-500 text-white px-3 py-1 rounded text-sm animate-pulse">
        🎆 Animations Active
      </div>
      
      {/* Dedicated Banner Section - Mobile Responsive */}
      <div className="w-full flex justify-center py-2 sm:py-4 bg-gray-50">
        <div className="w-[95%] sm:w-[90%] md:w-4/5 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-md sm:rounded-lg shadow-lg overflow-hidden bg-white">
          <SlideInTop>
            <img 
              src={banners.homePage || '/images/banners/home-banner.jpg'} 
              alt="Home Banner" 
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = '/images/banners/home-banner.jpg';
              }}
            />
          </SlideInTop>
        </div>
      </div>

      {/* Main Content Section - Mobile Responsive */}
      <div className="flex flex-col items-center px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      <SlideInLeft>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-700 mb-2 text-center">Welcome to Veena Crackers</h1>
      </SlideInLeft>
      <SlideInBottom>
        <p className="text-sm sm:text-base lg:text-lg mb-4 text-gray-700 text-center max-w-2xl">Your one-stop shop for all types of crackers. Quality, safety, and celebration guaranteed!</p>
      </SlideInBottom>
      
      {/* Dynamic Offers Section */}
      {!offersLoading && offers.length > 0 && (
        <SlideInBottom>
          <div className="w-full max-w-4xl mb-6 px-2 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">Special Offers</h2>
            <div className="grid gap-3 sm:gap-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border-l-4 border-yellow-500 p-3 sm:p-4 rounded-lg shadow-md" style={newsStyle}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {offer.offerIcon && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
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
                      <h3 className="font-bold text-base sm:text-lg" style={{ color: newsStyle.color }}>{offer.offerTitle}</h3>
                      <p className="text-sm sm:text-base" style={{ color: newsStyle.color }}>{offer.offerDescription}</p>
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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">Our Specialties</h2>
      </SlideInLeft>
      <StaggeredSlideInBottom>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 w-full max-w-4xl mx-auto mb-8 px-2 sm:px-0">
          {specialties.map((item) => (
            <div key={item.name} className="flex flex-col items-center rounded-lg shadow p-3 sm:p-4" style={itemGroupStyle}>
              <span className="text-2xl sm:text-3xl lg:text-4xl mb-2">{item.icon}</span>
              <span className="font-semibold text-xs sm:text-sm lg:text-base text-center" style={{ color: itemGroupStyle.color }}>{item.name}</span>
            </div>
          ))}
        </div>
      </StaggeredSlideInBottom>
      <SlideInLeft>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">Why Choose Us</h2>
      </SlideInLeft>
      <SlideInBottom>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 sm:p-6 mb-6 w-full max-w-2xl mx-2 sm:mx-auto text-center text-yellow-800 font-semibold text-sm sm:text-base">
          We provide all top branded deepavali crackers & other occasional Fire crackers retails and wholesale. We build your surprising occasion with lighting and sensational Gift box with our inspiring crackers.
        </div>
      </SlideInBottom>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl mx-auto mb-8 px-3 sm:px-0">
        <SlideInLeft>
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 sm:p-6 h-full flex flex-col justify-center">
            <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-2 sm:mb-4">Attractive</h3>
            <p className="text-gray-700 text-sm sm:text-base">Secure and innovative packaging of Crackers.</p>
          </div>
        </SlideInLeft>
        <SlideInRight>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 sm:p-6 h-full flex flex-col justify-center">
            <h3 className="text-lg sm:text-xl font-bold text-blue-700 mb-2 sm:mb-4">Manufacturing</h3>
            <p className="text-gray-700 text-sm sm:text-base">It is made from the finest raw materials.</p>
          </div>
        </SlideInRight>
        <SlideInLeft>
          <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-4 sm:p-6 h-full flex flex-col justify-center">
            <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-2 sm:mb-4">Colourful</h3>
            <p className="text-gray-700 text-sm sm:text-base">Our Crackers produce more colour and less smoke.</p>
          </div>
        </SlideInLeft>
        <SlideInRight>
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 sm:p-6 h-full flex flex-col justify-center">
            <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-2 sm:mb-4">Safety</h3>
            <p className="text-gray-700 text-sm sm:text-base">100% safe Crackers for childrens to use.</p>
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
      
      {/* Floating action buttons with crackers explosion */}
      <FloatingIcons />
    </>
  );
};

export default Home;
