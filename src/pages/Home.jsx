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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
      </SlideInLeft>
      <SlideInBottom>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 mb-6 w-full max-w-2xl text-center text-yellow-800 font-semibold">
          We provide all top branded deepavali crackers & other occasional Fire crackers retails and wholesale. We build your surprising occasion with lighting and sensational Gift box with our inspiring crackers. We provide all top branded deepavali crackers & other occasional Fire crackers retails and wholesale.
        </div>
      </SlideInBottom>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-700 mb-4">Attractive</h3>
          <p className="text-gray-700">Secure and innovative packaging of Crackers.</p>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Manufacturing</h3>
          <p className="text-gray-700">It is made from the finest raw materials.</p>
        </div>
        <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-pink-700 mb-4">Colourful</h3>
          <p className="text-gray-700">Our Crackers produce more colour and less smoke.</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-700 mb-4">Safety</h3>
          <p className="text-gray-700">100% safe Crackers for childrens to use.</p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-700 mb-4">Genuine Price</h3>
          <p className="text-gray-700">We can supply crackers at genuine price.</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-700 mb-4">Satisfaction</h3>
          <p className="text-gray-700">We Guarantee you that your full hearted pure satisfaction.</p>
        </div>
      </div>
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
