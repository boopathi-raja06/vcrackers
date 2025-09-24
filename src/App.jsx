import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Safety from './pages/Safety';
import Order from './pages/Order';
import Giftbox from './pages/Giftbox';

import AdminLogin from './pages/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminWrapper from './admin/AdminWrapper';
import DashboardStats from './admin/DashboardStats';
import ProductManagement from './admin/ProductManagement';
import ProductsPage from './admin/ProductsPage';
import OrdersPage from './admin/OrdersPage';
import OffersPage from './admin/OffersPage';
import ContactPage from './admin/ContactPage';
import BannerPage from './admin/BannerPage';
import GeneralPage from './admin/GeneralPage';
import VideoSettings from './admin/VideoSettings';
import PricelistSettings from './admin/PricelistSettings';

import Navbar from './components/Navbar';
import FloatingIcons from './components/FloatingIcons';
import { ColorProvider } from './contexts/ColorProvider';

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <ColorProvider>
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
        <Route path="/giftbox" element={<Giftbox />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminLayout />}>
          <Route index element={<DashboardStats />} />
          {/* Add more admin routes here: orders, etc. */}
        </Route>
        <Route path="/admin/*" element={<AdminWrapper />}>
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="banners" element={<BannerPage />} />
          <Route path="general" element={<GeneralPage />} />
          <Route path="video" element={<VideoSettings />} />
          <Route path="pricelist" element={<PricelistSettings />} />
        </Route>
        {/* Add more standalone admin routes here if needed */}
      </Routes>
    </Router>
    </ColorProvider>
  );
}

export default App;
