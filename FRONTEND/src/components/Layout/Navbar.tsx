import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Sun, Moon, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import Button from '../UI/Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleOrdersClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/orders');
    } else {
      navigate('/orders');
    }
  };

  const handleMobileOrdersClick = () => {
    handleOrdersClick();
    setIsMenuOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-50 py-4 transition-all duration-300 border-b border-border/30">
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-gradient">E-Shop</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium text-text-main hover:text-primary transition duration-200">
            Home
          </Link>
          
          <div className="flex items-center gap-6 border-l border-border pl-8">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-full hover:bg-primary/10 transition duration-200 text-text-muted hover:text-primary"
              aria-label="Toggle Theme"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user && (
              <>
                {/* Cart Link - Only for non-admin users */}
                {user.role !== 'admin' && (
                  <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-primary/10 transition duration-200 text-text-muted hover:text-primary" title="Shopping Cart">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-secondary h-2 w-2 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                )}

                {/* Orders Link - Click handler for role-based redirect */}
                <button 
                  onClick={handleOrdersClick}
                  className="p-2.5 rounded-full hover:bg-primary/10 transition duration-200 text-text-muted hover:text-primary" 
                  title={user.role === 'admin' ? 'Admin Orders' : 'My Orders'}
                >
                  <Package size={20} />
                </button>
              </>
            )}

            {/* Admin Link */}
            {user?.role === 'admin' && (
              <Link to="/admin" className="p-2.5 rounded-full hover:bg-primary/10 transition duration-200 text-text-muted hover:text-primary" title="Admin Dashboard">
                <Settings size={20} />
              </Link>
            )}

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg text-primary border border-primary/20">
                  <User size={16} />
                  <span className="text-xs font-semibold tracking-wide">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2.5 rounded-full hover:bg-danger/10 transition duration-200 text-text-muted hover:text-danger" 
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-sm font-semibold text-text-main hover:text-primary transition duration-200">
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-primary/10 text-text-muted transition duration-200"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 rounded-full hover:bg-primary/10 text-text-muted transition duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-border animate-fade-in">
          <div className="container py-6 space-y-6">
            {/* Mobile Links */}
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-lg font-semibold text-text-main hover:text-primary transition duration-200"
              >
                Home
              </Link>
              {user && (
                <>
                  {/* Cart Link - Only for non-admin users */}
                  {user.role !== 'admin' && (
                    <Link 
                      to="/cart" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="text-lg font-semibold text-text-main hover:text-primary transition duration-200 flex items-center justify-between"
                    >
                      <span>Cart</span>
                      {cartCount > 0 && (
                        <span className="bg-secondary h-2 w-2 rounded-full animate-pulse ml-2"></span>
                      )}
                    </Link>
                  )}
                  <button 
                    onClick={handleMobileOrdersClick} 
                    className="text-lg font-semibold text-text-main hover:text-primary transition duration-200 text-left"
                  >
                    {user.role === 'admin' ? 'Admin Orders' : 'My Orders'}
                  </button>
                </>
              )}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-lg font-semibold text-text-main hover:text-primary transition duration-200"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
            
            {/* Mobile User Section */}
            <div className="pt-6 border-t border-border">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-text-main">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="md" 
                    onClick={handleLogout}
                    className="w-full border-danger text-danger hover:bg-danger/10"
                  >
                    <LogOut size={18} /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
