import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FloatingContactButtons from './components/FloatingContactButtons/FloatingContactButtons';
import HomePage from './pages/HomePage/HomePage';
import ToursPage from './pages/ToursPage/ToursPage';
import HotelsPage from './pages/HotelsPage/HotelsPage';
import ForeignPage from './pages/ForeignPage/ForeignPage';
import CruisesPage from './pages/CruisesPage/CruisesPage';
import ContactPage from './pages/ContactPage/ContactPage';
import PrivacyPage from './pages/PrivacyPage/PrivacyPage';
import TermsPage from './pages/TermsPage/TermsPage';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import ServicePage from './pages/ServicePage/ServicePage';
import PromotionsPage from './pages/PromotionsPage/PromotionsPage';
import HotelDetailPage from './pages/HotelDetailPage/HotelDetailPage';
import TourDetailPage from './pages/TourDetailPage/TourDetailPage';
import ForeignTourDetailPage from './pages/ForeignTourDetailPage/ForeignTourDetailPage';
import CruiseDetailPage from './pages/CruiseDetailPage/CruiseDetailPage';
import PromotionDetailPage from './pages/PromotionDetailPage/PromotionDetailPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Cart from './components/Cart/Cart';
import Profile from './components/Profile/Profile';
import Orders from './components/Orders/Orders';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDetailPage from './components/Admin/UserDetailPage';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/foreign" element={<ForeignPage />} />
          <Route path="/cruises" element={<CruisesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/tour/:id" element={<TourDetailPage />} />
          <Route path="/foreign-tour/:id" element={<ForeignTourDetailPage />} />
          <Route path="/cruise/:id" element={<CruiseDetailPage />} />
          <Route path="/promotion/:id" element={<PromotionDetailPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/user/:id" element={<UserDetailPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingContactButtons />}
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
