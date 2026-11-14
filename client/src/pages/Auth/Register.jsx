import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
// FIX: Adjusted path to go up two folders
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Avatar State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- PASSWORD STRENGTH ANALYZER ---
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score, label: '', color: 'bg-gray-800' };
    
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1; // Contains uppercase
    if (/[0-9]/.test(pass)) score += 1; // Contains number
    if (/[^A-Za-z0-9]/.test(pass)) score += 1; // Contains special character

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 3) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(password);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const cancelImageSelection = () => {
    setFile(null);
    setPreview('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // HARD VALIDATIONS
    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }
    if (strength.score < 2) {
      return setError('Password is too weak. Add numbers or symbols.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    setError('');

    try {
      // 1. Register the user
      const registerRes = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      let newUserData = registerRes.data;

      // 2. Secretly upload avatar if selected
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          
          const avatarConfig = { 
            headers: { 
              Authorization: `Bearer ${newUserData.token}`,
              'Content-Type': 'multipart/form-data'
            } 
          };
          
          const avatarRes = await axios.post('http://localhost:5000/api/users/avatar', formData, avatarConfig);
          newUserData = avatarRes.data; 
        } catch (avatarErr) {
          console.error("Avatar upload failed during registration", avatarErr);
        }
      }

      // 3. Save & Redirect
      localStorage.setItem('user', JSON.stringify(newUserData));
      if (setUser) setUser(newUserData);
      
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-bodyText flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-darkCard border border-gray-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-heading font-black text-headings tracking-tight">JOIN <span className="text-primary">ARK.</span></h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Create your athlete profile</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-center text-sm font-bold tracking-wide relative z-10">
            {error}
          </div>
        )}

        {/* AVATAR UPLOADER */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className={`w-28 h-28 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-xl bg-darkBg flex items-center justify-center ${file ? 'border-primary' : 'border-gray-800 group-hover:border-primary/50'}`}>
              {preview ? (
                <img src={preview} alt="Profile Preview" className="w-full h-full object-cover transition-opacity duration-300" />
              ) : (
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              )}
            </div>
            
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase tracking-widest text-center px-2">Upload</span>
            </div>
          </div>
          
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

          <AnimatePresence>
            {file && (
              <motion.button 
                initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }} 
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                type="button"
                onClick={cancelImageSelection}
                className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                Remove
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 relative z-10">
          <div>
            <input 
              type="text" 
              required 
              placeholder="Username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3.5 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div>
            <input 
              type="email" 
              required 
              placeholder="Email Address"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3.5 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          {/* PASSWORD FIELD WITH METER */}
          <div>
            <input 
              type="password" 
              required 
              placeholder="Password (Min 8 Chars)"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3.5 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {/* STRENGTH BARS */}
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4].map((level) => (
                <div 
                  key={level} 
                  className={`h-1.5 w-full rounded-full transition-colors duration-300 ${password && strength.score >= level ? strength.color : 'bg-gray-800'}`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-1 px-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">A-Z • 0-9 • #!%</p>
              <p className={`text-[10px] uppercase font-bold tracking-widest transition-colors duration-300 ${password ? strength.color.replace('bg-', 'text-') : 'text-transparent'}`}>
                {strength.label || 'None'}
              </p>
            </div>
          </div>

          <div>
            <input 
              type="password" 
              required 
              placeholder="Confirm Password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3.5 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-primary hover:bg-orange-500 text-headings font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Creating Profile...</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-sm font-bold text-gray-500">
            Already have an account? <Link to="/login" className="text-primary hover:text-orange-400 transition-colors">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;