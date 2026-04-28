import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct';
import CategoriesManagement from './pages/Admin/CategoriesManagement';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-product" element={
                <ProtectedRoute adminOnly>
                  <AddProduct />
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute adminOnly>
                  <CategoriesManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit-product/:id" element={
                <ProtectedRoute adminOnly>
                  <AddProduct />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <footer className="py-8 border-t border-border mt-20">
            <div className="container text-center text-muted text-sm">
              &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
