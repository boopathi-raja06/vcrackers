import React from 'react';
import ProductList from '../components/ProductList';

import diwaliBanner from '../assets/diwali.png';

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
  <img src={diwaliBanner} alt="Diwali Banner" className="w-full max-w-3xl rounded-lg shadow mb-6" />
      <h1 className="text-4xl font-bold text-red-700 mb-2">Welcome to Veena Crackers</h1>
      <p className="text-lg mb-4 text-gray-700">Your one-stop shop for all types of crackers. Quality, safety, and celebration guaranteed!</p>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 w-full max-w-2xl text-center text-yellow-800 font-semibold">
        Special Offer: Get up to 30% off on Diwali orders! Call: <span className="text-red-700">+91-9876543210</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Specialties</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 w-full max-w-3xl">
        {specialties.map((item) => (
          <div key={item.name} className="flex flex-col items-center bg-white rounded-lg shadow p-4">
            <span className="text-4xl mb-2">{item.icon}</span>
            <span className="font-semibold text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Products</h2>
      <ProductList />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-3xl mb-2">🎨</span>
          <span className="font-semibold">Attractive & Colourful</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-3xl mb-2">🏭</span>
          <span className="font-semibold">Manufacturing Quality</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-3xl mb-2">💰</span>
          <span className="font-semibold">Genuine Price</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-3xl mb-2">🛡️</span>
          <span className="font-semibold">Safety</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-3xl mb-2">😊</span>
          <span className="font-semibold">Satisfaction</span>
        </div>
      </div>
      <footer className="bg-gray-900 text-gray-100 w-full py-6 mt-8 rounded-lg">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="font-bold text-lg mb-2">Veena Crackers</h3>
          <p className="mb-2">123 Main Street, Sivakasi | Phone: +91-9876543210 | Email: info@veenacrackers.in</p>
          <p className="text-xs">Disclaimer: As per Supreme Court order, online sale of crackers is prohibited. This site is for information only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
