import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import nutritionService from '../services/nutritionService';
import axios from 'axios';

// UX UPGRADE: Local mini-database of common foods for the modal search feature
const foodDatabase = [
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "White Rice (100g)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Whole Egg (Large)", calories: 72, protein: 6, carbs: 0.4, fat: 4.8 },
  { name: "Oats (50g)", calories: 189, protein: 7, carbs: 34, fat: 3 },
  { name: "Whey Protein (1 scoop)", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: "Roti (1 medium)", calories: 120, protein: 4, carbs: 20, fat: 3 },
  { name: "Greek Yogurt (100g)", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: "Banana (Medium)", calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
];

const Nutrition = () => {
  const { user, setUser } = useContext(AuthContext); 
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeMeal, setActiveMeal] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  
  const [foodInput, setFoodInput] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  
  // Search & Filter State (Now safely inside the Add Food modal only)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const currentUser = typeof user === 'string' ? JSON.parse(user) : user;
  const [userGoals, setUserGoals] = useState(currentUser?.macroGoals || null);
  const hasCustomGoals = !!userGoals;
  const goals = userGoals || { calories: 2000, protein: 150, carbs: 200, fat: 60 };

  const [goalInput, setGoalInput] = useState({ 
    calories: goals.calories || '', 
    protein: goals.protein || '', 
    carbs: goals.carbs || '', 
    fat: goals.fat || '' 
  });

  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDateString = (dateObj) => {
    const offset = dateObj.getTimezoneOffset() * 60000;
    return new Date(dateObj.getTime() - offset).toISOString().slice(0, 10);
  };

  const dateString = formatDateString(currentDate);
  const isToday = dateString === formatDateString(new Date());

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const calculatePercentage = (current, goal) => Math.min(((current || 0) / (goal || 1)) * 100, 100);

  useEffect(() => {
    const fetchNutrition = async () => {
      setLoading(true);
      try {
        const data = await nutritionService.getDailyLog(dateString);
        setDailyLog(data);
      } catch (err) {
        console.error("Failed to fetch nutrition:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNutrition();
  }, [dateString]);

  const handleSaveFood = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        dateString: dateString,
        mealType: activeMeal,
        foodItem: {
          name: foodInput.name,
          calories: Number(foodInput.calories),
          protein: Number(foodInput.protein),
          carbs: Number(foodInput.carbs),
          fat: Number(foodInput.fat)
        }
      };
      const updatedLog = await nutritionService.addFoodItem(payload);
      setDailyLog(updatedLog);
      
      // Reset everything instantly so you never get trapped in a stale state
      setFoodInput({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      setSearchQuery('');
      setFilterType('All');
      setActiveMeal(null);
    } catch (err) {
      console.error("Failed to save food:", err);
    }
  };

  const handleDeleteFood = async (mealType, itemId) => {
    try {
      const updatedLog = await nutritionService.deleteFoodItem(dateString, mealType, itemId);
      setDailyLog(updatedLog);
    } catch (err) {
      console.error("Failed to delete food:", err);
    }
  };

  const handleSaveGoals = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        macroGoals: {
          calories: Number(goalInput.calories),
          protein: Number(goalInput.protein),
          carbs: Number(goalInput.carbs),
          fat: Number(goalInput.fat)
        }
      };
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      const res = await axios.put('http://localhost:5000/api/users/profile', payload, config);
      
      const updatedUser = res.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      
      setUserGoals(updatedUser.macroGoals);
      setShowGoalModal(false);
    } catch (err) {
      console.error("Failed to save goals:", err);
    }
  };

  const totals = dailyLog?.dailyTotals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const meals = dailyLog?.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] };

  // Filter Engine for the "Food Database" inside the modal
  const getFilteredDatabase = () => {
    return foodDatabase.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesFilter = true;
      if (filterType === 'High Protein') matchesFilter = item.protein >= 20;
      if (filterType === 'Low Calorie') matchesFilter = item.calories <= 150;
      if (filterType === 'High Carbs') matchesFilter = item.carbs >= 20;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredDB = getFilteredDatabase();

  return (
    <div className="min-h-screen bg-darkBg text-bodyText font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & TIME MACHINE */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-headings tracking-tight mb-4">
              NUTRITION <span className="text-primary">LOG.</span>
            </h1>
            
            <div className="inline-flex items-center bg-darkCard border border-gray-800 rounded-full p-1 shadow-lg">
              <button onClick={handlePrevDay} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 text-headings transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              
              <div className="px-3 text-center min-w-[90px] flex flex-col justify-center">
                <p className="text-headings font-bold text-sm uppercase tracking-widest leading-none mt-1">
                  {isToday ? "Today" : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                {!isToday && (
                  <button onClick={handleGoToToday} className="text-[9px] text-primary font-bold uppercase tracking-wider hover:text-orange-400 mt-1.5 leading-none">
                    Back to Today
                  </button>
                )}
              </div>

              <button onClick={handleNextDay} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 text-headings transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>

          {hasCustomGoals && (
            <button onClick={() => setShowGoalModal(true)} className="text-xs font-bold uppercase tracking-wider text-primary hover:text-orange-400 transition-colors bg-darkCard px-4 py-2 rounded-full border border-gray-800">
              Edit Goals
            </button>
          )}
        </header>

        {loading ? (
          <div className="py-20 text-center animate-pulse flex flex-col items-center">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="text-bodyText font-bold uppercase tracking-widest text-sm">Loading Data...</p>
          </div>
        ) : (
          <>
            {/* MACRO SUMMARY BENTO */}
            {!hasCustomGoals ? (
              <div className="bg-darkCard border border-primary/50 rounded-3xl p-8 mb-12 text-center shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                <h2 className="text-2xl font-heading font-black text-headings mb-2">Welcome to your Nutrition Hub</h2>
                <p className="text-bodyText mb-6 max-w-md mx-auto">You haven't set your daily calorie and macro targets yet. Get your targets from the calculator and lock them in here.</p>
                <button 
                  onClick={() => setShowGoalModal(true)}
                  className="bg-primary hover:bg-orange-500 text-headings font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  Set My Goals
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="col-span-2 md:col-span-1 bg-darkCard border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                  <p className="text-xs font-bold uppercase tracking-wider text-bodyText mb-2 relative z-10">Calories</p>
                  <h3 className="text-4xl font-heading font-black text-headings mb-1 relative z-10">{totals.calories}</h3>
                  <p className="text-xs font-medium text-bodyText/70 relative z-10">/ {goals.calories} kcal</p>
                  <div className="w-full bg-darkBg h-2 rounded-full mt-4 relative z-10 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${calculatePercentage(totals.calories, goals.calories)}%` }}></div>
                  </div>
                </div>

                {[
                  { label: 'Protein', current: totals.protein, goal: goals.protein, color: 'bg-blue-500' },
                  { label: 'Carbs', current: totals.carbs, goal: goals.carbs, color: 'bg-green-500' },
                  { label: 'Fat', current: totals.fat, goal: goals.fat, color: 'bg-yellow-500' }
                ].map((macro, idx) => (
                  <div key={idx} className="bg-darkCard border border-gray-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-bodyText mb-2">{macro.label}</p>
                      <h3 className="text-3xl font-heading font-black text-headings mb-1">{macro.current}g</h3>
                      <p className="text-xs font-medium text-bodyText/70">/ {macro.goal}g</p>
                    </div>
                    <div className="w-full bg-darkBg h-1.5 rounded-full mt-4 overflow-hidden">
                      <div className={`${macro.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${calculatePercentage(macro.current, macro.goal)}%` }}></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* MEALS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(meals).map((mealType, index) => (
                <motion.div 
                  key={mealType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-darkCard border border-gray-800 rounded-3xl p-6 md:p-8 hover:border-primary/50 transition-colors group flex flex-col"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-heading font-black text-headings uppercase tracking-wider">{mealType}</h3>
                    <button 
                      onClick={() => setActiveMeal(mealType)}
                      className="w-8 h-8 rounded-full bg-darkBg border border-gray-700 flex items-center justify-center text-headings hover:bg-primary hover:border-primary transition-all group-hover:scale-110"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex-grow">
                    {meals[mealType].length === 0 ? (
                      <div className="py-8 text-center border-2 border-dashed border-gray-800 rounded-2xl h-full flex items-center justify-center">
                        <p className="text-bodyText text-sm font-medium">No foods logged.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {meals[mealType].map((item, i) => (
                          <div key={item._id || i} className="flex justify-between items-center p-4 bg-darkBg rounded-2xl border border-gray-800/50 group/item relative overflow-hidden">
                            <div className="relative z-10">
                              <p className="text-headings font-bold text-sm mb-1">{item.name}</p>
                              <p className="text-xs text-bodyText font-medium">
                                {item.protein}g P • {item.carbs}g C • {item.fat}g F
                              </p>
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                              <div className="text-right">
                                <p className="text-primary font-black font-heading text-lg">{item.calories}</p>
                                <p className="text-[10px] uppercase tracking-wider text-bodyText font-bold">Kcal</p>
                              </div>
                              <button 
                                onClick={() => handleDeleteFood(mealType, item._id)}
                                className="opacity-0 group-hover/item:opacity-100 transition-opacity text-gray-500 hover:text-red-500 p-1 bg-darkCard rounded-full border border-gray-700 hover:border-red-500/50"
                                title="Delete Item"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* QUICK ADD MODAL WITH DB SEARCH */}
      <AnimatePresence>
        {activeMeal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
            onClick={() => { 
              setActiveMeal(null); 
              setSearchQuery(''); 
              setFilterType('All'); 
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-darkCard border border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-8"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
              
              {/* LEFT SIDE: DATABASE SEARCH */}
              <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-800 pb-6 md:pb-0 md:pr-8">
                <h2 className="text-xl font-heading font-black text-headings mb-4 uppercase">
                  Search Database
                </h2>
                
                <div className="space-y-3 mb-4">
                  <input 
                    type="text" 
                    placeholder="Search foods..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-headings focus:border-primary outline-none transition-colors"
                  />
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-headings focus:border-primary outline-none transition-colors"
                  >
                    <option value="All">All Items</option>
                    <option value="High Protein">High Protein</option>
                    <option value="Low Calorie">Low Calorie</option>
                    <option value="High Carbs">High Carbs</option>
                  </select>
                </div>

                <div className="h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {filteredDB.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setFoodInput({ name: item.name, calories: item.calories, protein: item.protein, carbs: item.carbs, fat: item.fat })}
                      className="p-3 bg-darkBg border border-gray-800 rounded-xl hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-bold text-headings">{item.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                        {item.calories} kcals • {item.protein}g P • {item.carbs}g C • {item.fat}g F
                      </p>
                    </div>
                  ))}
                  {filteredDB.length === 0 && (
                    <p className="text-xs text-gray-500 text-center mt-4">No matching foods in database.</p>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: MANUAL FORM */}
              <div className="flex-1">
                <h2 className="text-xl font-heading font-black text-headings mb-4 uppercase">
                  Add to {activeMeal}
                </h2>
                <form onSubmit={handleSaveFood} className="space-y-4 relative z-10">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Food Name</label>
                    <input type="text" required value={foodInput.name} onChange={e => setFoodInput({...foodInput, name: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-2.5 text-headings focus:border-primary focus:outline-none transition-colors" placeholder="e.g. Custom Meal" />
                  </div>
                  
                  {/* FIX APPLIED HERE: step="any" allows decimals */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-bodyText mb-1">Calories</label>
                      <input type="number" step="any" required min="0" value={foodInput.calories} onChange={e => setFoodInput({...foodInput, calories: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-3 py-2 text-headings focus:border-primary focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-bodyText mb-1">Protein (g)</label>
                      <input type="number" step="any" required min="0" value={foodInput.protein} onChange={e => setFoodInput({...foodInput, protein: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-3 py-2 text-headings focus:border-blue-500 focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-bodyText mb-1">Carbs (g)</label>
                      <input type="number" step="any" required min="0" value={foodInput.carbs} onChange={e => setFoodInput({...foodInput, carbs: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-3 py-2 text-headings focus:border-green-500 focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-bodyText mb-1">Fat (g)</label>
                      <input type="number" step="any" required min="0" value={foodInput.fat} onChange={e => setFoodInput({...foodInput, fat: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-3 py-2 text-headings focus:border-yellow-500 focus:outline-none transition-colors" />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => { setActiveMeal(null); setSearchQuery(''); setFilterType('All'); }} className="flex-1 py-3 rounded-xl border border-gray-700 text-headings font-bold text-sm hover:bg-gray-800 transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 py-3 rounded-xl bg-primary hover:bg-orange-500 text-white font-bold text-sm transition-colors shadow-[0_0_20px_rgba(249,115,22,0.2)]">Lock It In</button>
                  </div>
                </form>
              </div>

            </motion.div>
          </motion.div>
        )}

        {/* SET GOALS MODAL */}
        {showGoalModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-darkCard border border-primary/50 rounded-3xl p-8 w-full max-w-md shadow-[0_0_40px_rgba(249,115,22,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <h2 className="text-2xl font-heading font-black text-headings mb-2 uppercase">
                Configure Goals
              </h2>
              <p className="text-sm text-bodyText mb-6">Enter the daily targets you received from the calculator.</p>
              
              <form onSubmit={handleSaveGoals} className="space-y-4 relative z-10">
                
                {/* FIX APPLIED HERE: step="any" allows decimals for goals too */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Daily Calories</label>
                  <input type="number" step="any" required value={goalInput.calories} onChange={e => setGoalInput({...goalInput, calories: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-headings focus:border-primary focus:outline-none transition-colors" placeholder="e.g. 2500" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Pro (g)</label>
                    <input type="number" step="any" required value={goalInput.protein} onChange={e => setGoalInput({...goalInput, protein: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-headings focus:border-blue-500 focus:outline-none transition-colors" placeholder="180" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Carbs (g)</label>
                    <input type="number" step="any" required value={goalInput.carbs} onChange={e => setGoalInput({...goalInput, carbs: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-headings focus:border-green-500 focus:outline-none transition-colors" placeholder="250" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-bodyText mb-2">Fat (g)</label>
                    <input type="number" step="any" required value={goalInput.fat} onChange={e => setGoalInput({...goalInput, fat: e.target.value})} className="w-full bg-darkBg border border-gray-700 rounded-xl px-4 py-3 text-headings focus:border-yellow-500 focus:outline-none transition-colors" placeholder="70" />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowGoalModal(false)} className="flex-1 py-4 rounded-xl border border-gray-700 text-headings font-bold hover:bg-gray-800 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 rounded-xl bg-primary hover:bg-orange-500 text-white font-bold transition-colors shadow-[0_0_20px_rgba(249,115,22,0.2)]">Lock It In</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Nutrition;