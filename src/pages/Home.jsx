import React from 'react';
import { SlideInTop, SlideInLeft, SlideInBottom, StaggeredSlideInBottom } from '../components/MotionWrappers';
import ProductList from '../components/ProductList';

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
  return (
    <div className="flex flex-col items-center px-4 py-8">
      <SlideInTop>
        <img src={diwaliBanner} alt="Diwali Banner" className="w-full rounded-lg shadow mb-6" />
      </SlideInTop>
      <SlideInLeft>
        <h1 className="text-4xl font-bold text-red-700 mb-2">Welcome to Veena Crackers</h1>
      </SlideInLeft>
      <SlideInBottom>
        <p className="text-lg mb-4 text-gray-700">Your one-stop shop for all types of crackers. Quality, safety, and celebration guaranteed!</p>
      </SlideInBottom>
      <SlideInBottom>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 w-full max-w-2xl text-center text-yellow-800 font-semibold">
          Special Offer: Get up to 30% off on Diwali orders! Call: <span className="text-red-700">+91-9876543210</span>
        </div>
      </SlideInBottom>
      <SlideInLeft>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Specialties</h2>
      </SlideInLeft>
      <StaggeredSlideInBottom>
        {specialties.map((item) => (
          <div key={item.name} className="flex flex-col items-center bg-white rounded-lg shadow p-4">
            <span className="text-4xl mb-2">{item.icon}</span>
            <span className="font-semibold text-gray-700">{item.name}</span>
          </div>
        ))}
      </StaggeredSlideInBottom>
      <SlideInLeft>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
      </SlideInLeft>
      <StaggeredSlideInBottom>
        {[
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center" key="colorful">
            <span className="text-3xl mb-2">🎨</span>
            <span className="font-semibold">Attractive & Colourful</span>
          </div>,
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center" key="quality">
            <span className="text-3xl mb-2">🏭</span>
            <span className="font-semibold">Manufacturing Quality</span>
          </div>,
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center" key="price">
            <span className="text-3xl mb-2">💰</span>
            <span className="font-semibold">Genuine Price</span>
          </div>,
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center" key="safety">
            <span className="text-3xl mb-2">🛡️</span>
            <span className="font-semibold">Safety</span>
          </div>,
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center" key="satisfaction">
            <span className="text-3xl mb-2">😊</span>
            <span className="font-semibold">Satisfaction</span>
          </div>
        ]}
      </StaggeredSlideInBottom>
      <SlideInBottom>
        <footer className="bg-gray-900 text-gray-100 w-full h-[30vh] flex items-center justify-center mt-8 rounded-lg">
          <div className="mx-auto px-4 text-center">
            <h3 className="font-bold text-2xl mb-4">Veena Crackers</h3>
            <p className="mb-4 text-lg">123 Main Street, Sivakasi | Phone: +91-9876543210 | Email: info@veenacrackers.in</p>
            <p className="text-base">Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.</p>
          </div>
        </footer>
      </SlideInBottom>
    </div>
  );
};

export default Home;
