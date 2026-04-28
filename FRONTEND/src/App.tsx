import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct';
import CategoriesManagement from './pages/Admin/CategoriesManagement';
import OrdersManagement from './pages/Admin/OrdersManagement';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
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
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
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
                <Route path="/admin/orders" element={
                  <ProtectedRoute adminOnly>
                    <OrdersManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/edit-product/:id" element={
                  <ProtectedRoute adminOnly>
                    <AddProduct />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <footer className="py-12 border-t border-border mt-20 bg-card">
              <div className="container grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-primary">E-Shop</h3>
                  <p className="text-muted text-sm">
                    Your premium destination for the latest trends and essential products. Quality guaranteed.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-muted">
                    <li><a href="/" className="hover:text-primary transition">Home</a></li>
                    <li><a href="/cart" className="hover:text-primary transition">Cart</a></li>
                    <li><a href="/login" className="hover:text-primary transition">Login</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Newsletter</h4>
                  <div className="flex gap-2">
                    <input type="email" placeholder="Email address" className="bg-main border border-border px-3 py-2 rounded-lg text-sm w-full" />
                    <button className="btn btn-primary px-4 py-2 text-xs">Join</button>
                  </div>
                </div>
              </div>
              <div className="container mt-12 pt-8 border-t border-border text-center text-muted text-sm">
                &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
