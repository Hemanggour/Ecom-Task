import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { UserPlus, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';

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
    <div className="h-screen flex items-center justify-center p-4 md:p-8 bg-main relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-primary-20 rounded-full blur-120px animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-secondary-20 rounded-full blur-120px animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <Card className="w-full max-w-lg p-8 md:p-12 glass border-white-20 shadow-xl relative z-10 animate-fade-in overflow-visible">
        {/* Logo/Icon Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-secondary to-primary p-0.5 mb-8 shadow-lg bg-secondary opacity-30">
            <div className="w-full h-full bg-card rounded-14px flex items-center justify-center">
              <UserPlus className="text-secondary" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight text-main">
            Create <span className="text-gradient">Account</span>
          </h1>
          <p className="text-muted font-medium text-lg">Join our premium community today</p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-danger-10 border border-danger-20 text-danger rounded-xl text-sm font-bold flex items-center gap-3 animate-fade-in">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <Input 
              label="Full Name"
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="John Doe"
              className="bg-card opacity-50"
            />

            <Input 
              label="Email Address"
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="name@example.com"
              className="bg-card opacity-50"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-muted uppercase tracking-wider mb-2 block">Password</label>
                <Input 
                  type="password" 
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="••••••••"
                  className="bg-card opacity-50"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-muted uppercase tracking-wider mb-2 block">Confirm</label>
                <Input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                  placeholder="••••••••"
                  className="bg-card opacity-50"
                />
              </div>
            </div>
          </div>

          <Button 
            variant="primary"
            size="lg"
            type="submit" 
            disabled={loading}
            isLoading={loading}
            className="w-full h-14 shadow-primary-25 rounded-xl text-base font-bold group"
          >
            {loading ? 'Creating Account...' : (
              <span className="flex items-center justify-center gap-2">
                Create Account <ArrowRight size={20} />
              </span>
            )}
          </Button>
        </form>

        <div className="relative my-12 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border"></div>
          </div>
          <span className="relative px-6 bg-card text-muted text-sm font-bold uppercase tracking-widest">
            or
          </span>
        </div>

        <div className="text-center">
          <p className="text-muted text-lg font-medium mb-6">
            Already have an account?
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full border-2 border border text-main font-bold rounded-xl hover:bg-card transition-all duration-200 text-base"
          >
            Sign In Now
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
