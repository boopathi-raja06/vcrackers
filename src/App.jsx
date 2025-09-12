import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Order from './pages/Order';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import Navbar from './components/Navbar';
import FloatingIcons from './components/FloatingIcons';

function App() {
  return (
    <Router>
      <Navbar />
      <FloatingIcons />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/order" element={<Order />} />
        <Route path="/safety" element={<div className='p-8'><h1 className='text-2xl font-bold text-red-700 mb-4'>Safety Tips</h1><ul className='list-disc pl-6'><li>Read instructions before use</li><li>Keep crackers away from children</li><li>Use outdoors only</li><li>Keep water nearby</li><li>Dispose safely</li></ul></div>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
