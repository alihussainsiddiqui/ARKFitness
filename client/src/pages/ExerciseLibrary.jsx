import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const ExerciseLibrary = () => {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [activeMuscle, setActiveMuscle] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const currentUser = typeof user === 'string' ? JSON.parse(user) : user;
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        
        const res = await axios.get(`http://localhost:5000/api/exercises?search=${search}&muscleGroup=${activeMuscle}`, config);
        setExercises(res.data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => fetchExercises(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, activeMuscle, user]);

  // Lock background scroll when popup is open
  useEffect(() => {
    if (selectedExercise) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedExercise]);

  return (
    <div className="min-h-screen bg-darkBg text-bodyText font-sans p-6 md:p-12 relative selection:bg-primary selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary text-xs font-black tracking-[0.3em] uppercase mb-3 block">Master Catalog</span>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-headings tracking-tight mb-3 uppercase">
              EXERCISE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">LIBRARY.</span>
            </h1>
            <p className="text-bodyText font-medium text-lg max-w-2xl">
              Explore professional execution guides, target muscle breakdown, and dynamic technique breakdowns for complete body progression.
            </p>
          </motion.div>
        </header>

        {/* SEARCH & FILTER BAR */}
        <div className="sticky top-0 z-20 bg-darkBg/90 backdrop-blur-xl py-6 mb-10 border-b border-gray-800/80">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            
            {/* Search Input */}
            <div className="w-full md:w-1/3 relative group">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Search exercises by name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-darkCard border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-headings focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-inner text-sm font-medium"
              />
            </div>

            {/* Muscle Filter Pills */}
            <div className="w-full md:w-2/3">
              <div className="flex flex-wrap gap-2 md:justify-end">
                {muscleGroups.map(muscle => (
                  <button
                    key={muscle}
                    onClick={() => setActiveMuscle(muscle)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 ${
                      activeMuscle === muscle 
                        ? 'bg-primary text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-105' 
                        : 'bg-darkCard text-bodyText hover:text-headings hover:bg-gray-800 border border-gray-800/80'
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* EXERCISES GRID */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-bodyText font-bold uppercase tracking-widest text-xs">Loading Catalog...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-24 bg-darkCard rounded-3xl border border-dashed border-gray-800">
            <p className="text-2xl font-heading font-black text-headings mb-2">No exercises found</p>
            <p className="text-bodyText text-sm">Try broadening your search terms or resetting filters.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {exercises.map((exercise, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  key={exercise._id} 
                  onClick={() => setSelectedExercise(exercise)}
                  className="bg-darkCard rounded-3xl border border-gray-800/80 hover:border-primary/60 transition-all duration-500 group flex flex-col overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)] hover:-translate-y-1.5"
                >
                  {/* Card Image Wrapper with Zoom Effect */}
                  <div className="h-48 w-full overflow-hidden relative bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-darkCard via-transparent to-black/30 z-10"></div>
                    {exercise.image && (
                      <img 
                        src={exercise.image} 
                        alt={exercise.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = 'https://placehold.co/800x500/1a1a1a/ea580c?text=Ark+Fitness'; }}
                      />
                    )}
                    <span className="absolute top-3 right-3 z-20 text-[10px] uppercase tracking-wider font-black bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/10">
                      {exercise.difficulty}
                    </span>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-black text-headings leading-tight mb-3 group-hover:text-primary transition-colors">
                      {exercise.name}
                    </h3>
                    
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-2.5 py-1 rounded-lg">
                        {exercise.muscleGroup}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 border border-gray-700/60 bg-darkBg px-2.5 py-1 rounded-lg">
                        {exercise.equipment}
                      </span>
                    </div>
                    
                    <p className="text-xs text-bodyText leading-relaxed mb-6 flex-grow line-clamp-3 font-medium opacity-90">
                      {exercise.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-800/80 flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{exercise.category}</span>
                      <span className="text-xs uppercase tracking-wider font-extrabold text-primary flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                        Full Guide 
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* FULL-SCREEN IMMERSIVE POPUP MODAL */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedExercise(null)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-darkCard w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] my-auto"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedExercise(null)}
                className="absolute top-6 right-6 z-30 w-12 h-12 bg-black/60 hover:bg-primary backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10 transition-all duration-300 shadow-xl group"
              >
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              {/* Modal Banner Image */}
              <div className="w-full h-72 md:h-[420px] bg-gray-900 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-darkCard via-darkCard/30 to-black/40 z-10"></div>
                {selectedExercise.image && (
                  <img 
                    src={selectedExercise.image} 
                    alt={selectedExercise.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/800x500/1a1a1a/ea580c?text=Ark+Fitness'; }}
                  />
                )}
                <div className="absolute bottom-8 left-8 md:left-12 z-20 flex gap-3 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-widest bg-primary text-white px-4 py-2 rounded-xl shadow-lg">
                    {selectedExercise.category}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest bg-darkBg/80 backdrop-blur-md text-headings px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                    {selectedExercise.difficulty}
                  </span>
                </div>
              </div>

              {/* Modal Content Section */}
              <div className="p-8 md:p-14 relative z-20 -mt-6">
                <h2 className="text-3xl md:text-5xl font-heading font-black text-headings tracking-tight mb-8 leading-tight">
                  {selectedExercise.name}
                </h2>
                
                {/* Metric Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-10">
                  <div className="bg-darkBg/80 border border-gray-800 rounded-2xl p-5 shadow-inner">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary mb-1">Target Muscle Group</p>
                    <p className="text-lg font-heading font-black text-headings">{selectedExercise.muscleGroup}</p>
                  </div>
                  <div className="bg-darkBg/80 border border-gray-800 rounded-2xl p-5 shadow-inner">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary mb-1">Required Equipment</p>
                    <p className="text-lg font-heading font-black text-headings">{selectedExercise.equipment}</p>
                  </div>
                </div>

                {/* Detailed Execution Breakdown */}
                <div className="space-y-4 bg-darkBg/40 border border-gray-800/80 p-6 md:p-8 rounded-3xl">
                  <h4 className="text-xl font-heading font-black text-headings tracking-wider uppercase flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                    Complete Execution & Technique Guide
                  </h4>
                  <p className="text-bodyText text-base md:text-lg leading-relaxed font-medium">
                    {selectedExercise.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-10 pt-6 border-t border-gray-800 flex justify-end">
                  <button 
                    onClick={() => setSelectedExercise(null)}
                    className="bg-primary hover:bg-orange-500 text-headings font-black py-4 px-10 rounded-2xl transition-all duration-300 tracking-wider text-sm shadow-[0_0_25px_rgba(249,115,22,0.4)]"
                  >
                    CLOSE GUIDE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExerciseLibrary;