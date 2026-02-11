import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Index from './pages/Index';
import LoginSelection from './pages/LoginSelection';
import AdminLogin from './pages/auth/AdminLogin';
import VendorLogin from './pages/auth/VendorLogin';
import UserLogin from './pages/auth/UserLogin';
import AdminSignup from './pages/auth/AdminSignup';
import VendorSignup from './pages/auth/VendorSignup';
import UserSignup from './pages/auth/UserSignup';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import ManageItems from './pages/vendor/ManageItems';
import ProductStatus from './pages/vendor/ProductStatus';
import VendorProducts from './pages/vendor/VendorProducts';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import VendorList from './pages/user/VendorList';
import ProductsPage from './pages/user/ProductsPage';
import ShoppingCart from './pages/user/ShoppingCart';
import Checkout from './pages/user/Checkout';
import OrderSuccess from './pages/user/OrderSuccess';
import OrderStatus from './pages/user/OrderStatus';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import VendorManagement from './pages/admin/VendorManagement';
import MembershipManagement from './pages/admin/MembershipManagement';

import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login-selection" element={<LoginSelection />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/vendor" element={<VendorLogin />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/signup/vendor" element={<VendorSignup />} />
          <Route path="/signup/user" element={<UserSignup />} />

          {/* Vendor Routes */}
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/manage-items"
            element={
              <ProtectedRoute requiredRole="vendor">
                <ManageItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/product-status"
            element={
              <ProtectedRoute requiredRole="vendor">
                <ProductStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/products"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorProducts />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/vendors"
            element={
              <ProtectedRoute requiredRole="user">
                <VendorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/products/:vendorId"
            element={
              <ProtectedRoute requiredRole="user">
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/cart"
            element={
              <ProtectedRoute requiredRole="user">
                <ShoppingCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/checkout"
            element={
              <ProtectedRoute requiredRole="user">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/order-success"
            element={
              <ProtectedRoute requiredRole="user">
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/order-status"
            element={
              <ProtectedRoute requiredRole="user">
                <OrderStatus />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <ProtectedRoute requiredRole="admin">
                <VendorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/memberships"
            element={
              <ProtectedRoute requiredRole="admin">
                <MembershipManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
