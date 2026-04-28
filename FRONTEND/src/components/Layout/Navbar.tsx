import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 py-4">
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          E-Shop
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          
          {user && (
            <>
              <Link to="/cart" className="relative hover:text-primary transition">
                <ShoppingCart size={24} />
              </Link>
              <Link to="/orders" className="hover:text-primary transition">
                <Package size={24} />
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="btn btn-outline py-1 px-3 text-sm">
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4 border-l border-border pl-6">
              <div className="flex items-center gap-2">
                <User size={20} className="text-muted" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="text-muted hover:text-danger transition">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-primary transition">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
