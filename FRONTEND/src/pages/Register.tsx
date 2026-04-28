import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container py-10">
      <div className="card max-w-md w-full glass">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <UserPlus className="text-primary" size={32} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-muted mb-8">Join us and start shopping today</p>

        {error && (
          <div className="p-4 mb-6 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              name="name"
              type="text" 
              required 
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              name="email"
              type="email" 
              required 
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              name="password"
              type="password" 
              required 
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input 
              name="confirmPassword"
              type="password" 
              required 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg justify-center disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
