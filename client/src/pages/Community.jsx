import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const Community = () => {
  const { user } = useContext(AuthContext);
  const currentUser = typeof user === 'string' ? JSON.parse(user) : user;
  
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  // NEW: State for the modal popup
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!currentUser?.token) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/users?search=${search}`, config);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, currentUser?.token]); 

  return (
    <div className="min-h-screen bg-darkBg text-bodyText p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Search Bar */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-800/80 pb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-headings tracking-tight mb-2">
              THE <span className="text-primary">COMMUNITY.</span>
            </h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Find other athletes on Ark Fitness
            </p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              placeholder="Search athletes by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-darkCard border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-headings focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-lg"
            />
            <svg className="w-6 h-6 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </header>

        {/* Results Grid */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-bodyText font-bold uppercase tracking-widest text-sm">Searching...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
            <p className="text-gray-500 font-bold uppercase tracking-widest">No athletes found matching "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((athlete, index) => (
              <motion.div 
                key={athlete._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedUser(athlete)}
                className="bg-darkCard border border-gray-800 rounded-3xl p-6 flex flex-col items-center text-center hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 bg-darkBg flex items-center justify-center shadow-lg mb-4 relative z-10 group-hover:border-primary transition-colors">
                  {athlete.avatar ? (
                    <img src={athlete.avatar} alt={athlete.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-black text-3xl uppercase">
                      {athlete.username.charAt(0)}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-heading font-black text-headings tracking-tight relative z-10">
                  {athlete.username}
                </h3>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Profile
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* USER PROFILE MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-darkCard border border-gray-800 rounded-[2rem] p-8 md:p-10 w-full max-w-lg shadow-2xl relative overflow-hidden text-center"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <div className="flex flex-col items-center relative z-10 mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/50 shadow-[0_0_20px_rgba(249,115,22,0.2)] bg-darkBg flex items-center justify-center mb-6">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-primary uppercase">
                      {selectedUser.username.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-heading font-black text-headings tracking-tight">
                  {selectedUser.username}
                </h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">
                  Joined {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Mini Macro Bento */}
              <div className="relative z-10">
                <h4 className="text-xs font-bold text-left uppercase tracking-widest text-bodyText mb-4">Nutrition Targets</h4>
                
                {selectedUser.macroGoals && selectedUser.macroGoals.calories ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-darkBg border border-gray-800 rounded-2xl p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Calories</p>
                      <p className="text-xl font-heading font-black text-headings">{selectedUser.macroGoals.calories}</p>
                    </div>
                    <div className="bg-darkBg border border-gray-800 rounded-2xl p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Protein</p>
                      <p className="text-xl font-heading font-black text-blue-500">{selectedUser.macroGoals.protein}g</p>
                    </div>
                    <div className="bg-darkBg border border-gray-800 rounded-2xl p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Carbs</p>
                      <p className="text-xl font-heading font-black text-green-500">{selectedUser.macroGoals.carbs}g</p>
                    </div>
                    <div className="bg-darkBg border border-gray-800 rounded-2xl p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Fat</p>
                      <p className="text-xl font-heading font-black text-yellow-500">{selectedUser.macroGoals.fat}g</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-darkBg border border-dashed border-gray-800 rounded-2xl p-6 text-center">
                    <p className="text-sm font-medium text-gray-500">This athlete hasn't locked in their nutrition targets yet.</p>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;