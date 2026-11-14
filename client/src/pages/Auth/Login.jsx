import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-darkCard p-8 rounded-2xl shadow-2xl border border-gray-800/50 relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-primary blur-xl opacity-50"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-black text-headings tracking-tight">WELCOME BACK</h2>
          <p className="text-bodyText text-sm mt-2">Sign in to track your progress.</p>
        </div>
        
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm font-medium text-center">
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-bodyText text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-darkBg border border-gray-700/50 rounded-lg p-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-bodyText text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-darkBg border border-gray-700/50 rounded-lg p-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] text-headings font-bold py-3.5 px-4 rounded-lg transition-all duration-300 mt-4 tracking-wide"
          >
            SIGN IN
          </button>
        </form>
        
        <p className="text-bodyText text-center mt-8 text-sm">
          Don't have an account? <Link to="/register" className="text-accent hover:text-primary font-semibold transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;