import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await axios.post('http://localhost:5000/api/contact', formData);
      setStatus({ type: 'success', text: res.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (err) {
      setStatus({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to send message. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-bodyText p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left Side: Copy */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-heading font-black text-headings tracking-tight mb-6">
            GET IN <span className="text-primary">TOUCH.</span>
          </h1>
          <p className="text-lg text-bodyText mb-8 max-w-md">
            Have a question about Ark Fitness, found a bug, or want to request a new feature? Drop us a message and our team will get back to you.
          </p>
          
          <div className="space-y-6 hidden md:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-darkCard border border-gray-800 rounded-xl flex items-center justify-center text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Us</p>
                <p className="text-headings font-bold">support@arkfitness.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-darkCard border border-gray-800 rounded-xl flex items-center justify-center text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</p>
                <p className="text-headings font-bold">Karachi, Pakistan</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 w-full bg-darkCard border border-gray-800 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            
            <AnimatePresence>
              {status.text && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-xl text-center text-sm font-bold tracking-wide mb-2 ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                >
                  {status.text}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  required 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3.5 text-headings focus:border-primary focus:outline-none transition-colors" 
                  placeholder="Your Name" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3.5 text-headings focus:border-primary focus:outline-none transition-colors" 
                  placeholder="you@email.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Subject</label>
              <input 
                type="text" 
                name="subject"
                required 
                value={formData.subject} 
                onChange={handleChange}
                className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3.5 text-headings focus:border-primary focus:outline-none transition-colors" 
                placeholder="How can we help?" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Message</label>
              <textarea 
                name="message"
                required 
                value={formData.message} 
                onChange={handleChange}
                rows="5"
                className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3.5 text-headings focus:border-primary focus:outline-none transition-colors resize-none custom-scrollbar" 
                placeholder="Write your message here..." 
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 bg-primary hover:bg-orange-500 text-headings font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Sending...</>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;