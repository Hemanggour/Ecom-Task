import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { LogIn, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 md:p-8 bg-main relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-primary-20 rounded-full blur-120px animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-secondary-20 rounded-full blur-120px animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <Card className="w-full max-w-lg p-8 md:p-12 glass border-white-20 shadow-xl relative z-10 animate-fade-in overflow-visible">
        {/* Logo/Icon Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 mb-8 shadow-lg bg-primary opacity-30">
            <div className="w-full h-full bg-card rounded-14px flex items-center justify-center">
              <LogIn className="text-primary" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight text-main">
            Welcome <span className="text-gradient">Back</span>
          </h1>
          <p className="text-muted font-medium text-lg">Please enter your details to sign in</p>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="p-4 mb-6 bg-success-10 border border-success-20 text-success rounded-xl text-sm font-bold flex items-center gap-3 animate-fade-in">
            <CheckCircle size={18} className="shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 bg-danger-10 border border-danger-20 text-danger rounded-xl text-sm font-bold flex items-center gap-3 animate-fade-in">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <Input 
              label="Email Address"
              type="email" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              required 
              placeholder="name@example.com"
              error={emailError}
              className="bg-card opacity-50"
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-muted uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">
                  Forgot?
                </Link>
              </div>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                required 
                placeholder="••••••••"
                error={passwordError}
                className="bg-card opacity-50"
              />
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
            {loading ? 'Authenticating...' : (
              <span className="flex items-center justify-center gap-2">
                Sign In <ArrowRight size={20} className="arrow-right" />
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
            Don't have an account?
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full border-2 border border text-main font-bold rounded-xl hover:bg-card transition-all duration-200 text-base"
          >
            Create Premium Account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
