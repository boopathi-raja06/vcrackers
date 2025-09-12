import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Safety from './pages/Safety';
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
  <Route path="/safety" element={<Safety />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
    {/* Redirect old admin routes to dashboard */}
    <Route path="/admin/products" element={<Navigate to="/admin/dashboard/products" replace />} />
    <Route path="/admin/orders" element={<Navigate to="/admin/dashboard/orders" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
