import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer pages
import MenuPage from './pages/customer/MenuPage';
import OrderPage from './pages/customer/OrderPage';
import PaymentPage from './pages/customer/PaymentPage';

// Kitchen pages
import KitchenDashboard from './pages/kitchen/KitchenDashboard';

// Restaurant Admin pages
import AdminDashboard from './pages/admin/restaurant/AdminDashboard';
import MenuManagement from './pages/admin/restaurant/MenuManagement';
import OrderHistory from './pages/admin/restaurant/OrderHistory';
import StaffManagement from './pages/admin/restaurant/StaffManagement';
import RestaurantSettings from './pages/admin/restaurant/RestaurantSettings';

// Platform Admin pages
import PlatformDashboard from './pages/admin/platform/PlatformDashboard';
import RestaurantManagement from './pages/admin/platform/RestaurantManagement';
import SystemSettings from './pages/admin/platform/SystemSettings';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Customer routes */}
        <Route path="/menu/:restaurantId" element={<MenuPage />} />
        <Route path="/order/:orderId" element={<OrderPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        
        {/* Kitchen staff routes */}
        <Route path="/kitchen" element={<KitchenDashboard />} />
        
        {/* Restaurant admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<MenuManagement />} />
        <Route path="/admin/orders" element={<OrderHistory />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/settings" element={<RestaurantSettings />} />
        
        {/* Platform admin routes */}
        <Route path="/platform/dashboard" element={<PlatformDashboard />} />
        <Route path="/platform/restaurants" element={<RestaurantManagement />} />
        <Route path="/platform/settings" element={<SystemSettings />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App; 