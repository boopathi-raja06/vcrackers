import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Safety from './pages/Safety';
import Order from './pages/Order';

import AdminLogin from './pages/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import DashboardStats from './admin/DashboardStats';
import ProductManagement from './admin/ProductManagement';
import ProductsPage from './admin/ProductsPage';

import Navbar from './components/Navbar';
import FloatingIcons from './components/FloatingIcons';

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-700"></div>
        </div>
      )}
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
        <Route path="/admin/dashboard/*" element={<AdminLayout />}>
          <Route index element={<DashboardStats />} />
          <Route path="products" element={<ProductsPage />} />
          {/* Add more admin routes here: orders, etc. */}
        </Route>
        {/* Redirect old admin routes to dashboard */}
        <Route path="/admin/products" element={<Navigate to="/admin/dashboard/products" replace />} />
        <Route path="/admin/orders" element={<Navigate to="/admin/dashboard/orders" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
