import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-darkBg border-t border-gray-800/50 pt-16 pb-8 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Brand Only */}
        <div className="mb-16 border-b border-gray-800/50 pb-16">
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-darkBg font-black text-xl group-hover:rotate-180 transition-transform duration-500">A</div>
              <span className="font-heading font-black text-2xl tracking-tight text-headings">
                ARK<span className="text-primary font-normal">FITNESS</span>
              </span>
            </Link>
            <p className="text-bodyText text-sm leading-relaxed mb-6">
              The premium digital tracking solution for athletes who demand more from their training data. Built for progression.
            </p>
            <div className="flex gap-3">
              {/* Simple SVG Social Icons */}
              <a href="#" className="w-9 h-9 rounded-full bg-darkCard border border-gray-800 flex items-center justify-center text-bodyText hover:text-primary hover:border-primary/50 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-darkCard border border-gray-800 flex items-center justify-center text-bodyText hover:text-primary hover:border-primary/50 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-headings font-bold uppercase tracking-wider text-xs mb-4 border-l-2 border-primary pl-2">Product</h4>
            <div className="flex flex-col gap-3 text-sm text-bodyText font-medium">
              <Link to="/register" className="hover:text-primary transition-colors">Start Free Trial</Link>
              <Link to="/login" className="hover:text-primary transition-colors">Log In</Link>
              <Link to="#" className="hover:text-primary transition-colors">Features</Link>
              <Link to="#" className="hover:text-primary transition-colors">Changelog</Link>
            </div>
          </div>
          <div>
            <h4 className="text-headings font-bold uppercase tracking-wider text-xs mb-4 border-l-2 border-primary pl-2">Resources</h4>
            <div className="flex flex-col gap-3 text-sm text-bodyText font-medium">
              <Link to="#" className="hover:text-primary transition-colors">Help Center</Link>
              <Link to="#" className="hover:text-primary transition-colors">API Documentation</Link>
              <Link to="#" className="hover:text-primary transition-colors">Community</Link>
            </div>
          </div>
          <div>
            <h4 className="text-headings font-bold uppercase tracking-wider text-xs mb-4 border-l-2 border-primary pl-2">Company</h4>
            <div className="flex flex-col gap-3 text-sm text-bodyText font-medium">
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link to="#" className="hover:text-primary transition-colors">Careers</Link>
            </div>
          </div>
          <div>
            <h4 className="text-headings font-bold uppercase tracking-wider text-xs mb-4 border-l-2 border-primary pl-2">Legal</h4>
            <div className="flex flex-col gap-3 text-sm text-bodyText font-medium">
              <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-bodyText pt-8 border-t border-gray-800/50">
          <p>&copy; {new Date().getFullYear()} Ark Fitness. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;