import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Safely parse user in case it gets stored as a string
  const currentUser = typeof user === 'string' ? JSON.parse(user) : user;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-darkBg/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.div 
            whileHover={{ rotate: 180 }} 
            transition={{ duration: 0.3 }}
            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-darkBg font-black text-xl"
          >
            A
          </motion.div>
          <span className="font-heading font-black text-2xl tracking-tight text-headings group-hover:text-primary transition-colors">
            ARK<span className="text-primary font-normal">FITNESS</span>
          </span>
        </Link>

        {/* Desktop Dynamic Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold uppercase tracking-wider">
          {/* ALWAYS VISIBLE LINKS */}
          <Link to="/" className="text-bodyText hover:text-headings transition-colors">Home</Link>
          <Link to="/about" className="text-bodyText hover:text-headings transition-colors">About</Link>
          <Link to="/contact" className="text-bodyText hover:text-headings transition-colors">Contact</Link>
          
          <div className="w-px h-6 bg-gray-800"></div>

          {/* CONDITIONAL AUTH LINKS */}
          {currentUser ? (
            <>
              <Link to="/dashboard" className="text-bodyText hover:text-headings transition-colors">Dashboard</Link>
              <Link to="/nutrition" className="text-bodyText hover:text-headings transition-colors">Nutrition</Link>
              <Link to="/library" className="text-bodyText hover:text-headings transition-colors">Library</Link>
              <Link to="/community" className="text-bodyText hover:text-headings transition-colors">Community</Link>
              
              {/* DESKTOP AVATAR LINK */}
              <Link to="/profile" className="flex items-center gap-3 ml-2 group border-l border-gray-800 pl-6">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 group-hover:border-primary transition-colors bg-darkBg flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-bold text-lg">
                      {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </Link>

              <button 
                onClick={handleLogout} 
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-lg transition-all ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-bodyText hover:text-headings transition-colors">Login</Link>
              <Link to="/register" className="bg-primary hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] text-headings px-6 py-2.5 rounded-lg transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="lg:hidden text-headings hover:text-primary transition-colors focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-darkCard border-b border-gray-800/80 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col space-y-5 text-sm font-bold uppercase tracking-wider">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-headings hover:text-primary transition-colors">Home</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-headings hover:text-primary transition-colors">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-headings hover:text-primary transition-colors">Contact</Link>
              
              <div className="h-px w-full bg-gray-800"></div>

              {currentUser ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-headings hover:text-primary transition-colors">Dashboard</Link>
                  <Link to="/nutrition" onClick={() => setIsMobileMenuOpen(false)} className="text-headings hover:text-primary transition-colors">Nutrition</Link>
                  <Link to="/library" onClick={() => setIsMobileMenuOpen(false)} className="text-headings hover:text-primary transition-colors">Library</Link>
                  <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-headings hover:text-primary transition-colors">Community</Link>
                  
                  {/* MOBILE AVATAR LINK */}
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-headings hover:text-primary transition-colors py-2 border-y border-gray-800/50">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700 bg-darkBg flex items-center justify-center">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold">
                          {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    Profile
                  </Link>

                  <button 
                    onClick={handleLogout} 
                    className="text-left text-red-500 hover:text-red-400 transition-colors pt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-headings hover:text-primary transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:text-orange-400 transition-colors">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;