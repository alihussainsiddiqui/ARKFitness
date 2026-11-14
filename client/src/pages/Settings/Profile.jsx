import React, { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); 
  const currentUser = typeof user === 'string' ? JSON.parse(user) : user;
  
  // Avatar State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentUser?.avatar || '');
  
  // Profile Details State
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // --- STAGE THE IMAGE FOR UPLOAD ---
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Show local preview only
    }
  };

  const cancelImageSelection = () => {
    setFile(null);
    setPreview(currentUser?.avatar || ''); // Revert preview back to original
  };

  // --- SINGLE MASTER UPDATE FUNCTION ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let updatedUser = currentUser;

      // 1. If a new image was selected, upload it to Cloudinary first
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const avatarConfig = { 
          headers: { 
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'multipart/form-data'
          } 
        };
        const avatarRes = await axios.post('http://localhost:5000/api/users/avatar', formData, avatarConfig);
        updatedUser = avatarRes.data; // Capture the new avatar URL
      }

      // 2. Update the text details (Username, Email, Password)
      const profileConfig = { headers: { Authorization: `Bearer ${updatedUser.token}` } };
      const profileRes = await axios.put('http://localhost:5000/api/users/profile', { username, email, password }, profileConfig);
      
      // Merge the results (ensuring we don't lose the new avatar in the response)
      updatedUser = { ...profileRes.data, avatar: updatedUser.avatar };
      
      // 3. Save to Global State & Local Storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      
      // Clean up the form
      setPassword('');
      setConfirmPassword('');
      setFile(null);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-bodyText p-6 md:p-12 font-sans flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-darkCard border border-gray-800 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

        <h1 className="text-3xl font-heading font-black text-headings tracking-tight mb-8 text-center relative z-10">
          PROFILE SETTINGS
        </h1>

        <div className="relative z-10">
          
          {/* AVATAR STAGING SECTION */}
          <div className="flex flex-col items-center mb-8 border-b border-gray-800/80 pb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-xl bg-darkBg flex items-center justify-center relative ${file ? 'border-primary' : 'border-gray-800 group-hover:border-primary/50'}`}>
                
                {preview ? (
                  <img src={preview} alt="Profile Preview" className="w-full h-full object-cover transition-opacity duration-300" />
                ) : (
                  <span className="text-4xl font-black text-primary uppercase">
                    {currentUser?.username?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
            </div>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

            <AnimatePresence>
              {file ? (
                <motion.button 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }} 
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  type="button"
                  onClick={cancelImageSelection}
                  className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  Cancel Selection
                </motion.button>
              ) : (
                <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Click to change picture
                </p>
              )}
            </AnimatePresence>
          </div>

          {/* STATUS MESSAGES */}
          {message.text && (
            <div className={`p-4 rounded-xl text-center text-sm font-bold tracking-wide mb-6 ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}

          {/* SINGLE MASTER FORM */}
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-800/80">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password (Optional)</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all mb-4"
              />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-primary hover:bg-orange-500 text-headings font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Saving...</>
              ) : (
                'Save Profile Changes'
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default Profile;