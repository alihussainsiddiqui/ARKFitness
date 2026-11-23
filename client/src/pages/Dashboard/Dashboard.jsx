import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../../contexts/AuthContext';
import workoutService from '../../services/workoutService';
import DataExport from '../../Components/DataExport';
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [workoutsData, statsData] = await Promise.all([
          workoutService.getWorkouts(dateString),
          workoutService.getWeeklyStats()
        ]);
        setWorkouts(workoutsData);
        setChartData(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate, dateString]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts(workouts.filter((workout) => workout._id !== id));

      const updatedStats = await workoutService.getWeeklyStats();
      setChartData(updatedStats);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentUser = typeof user === 'string' ? JSON.parse(user) : user;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-darkBg p-6 md:p-10 font-sans text-bodyText">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-gray-800/80 mb-10"
        >
          {/* Dashboard Left Side: Avatar + Name */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 bg-darkBg flex items-center justify-center shadow-lg">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-black text-2xl uppercase">
                  {currentUser?.username?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div>
              <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-1">Overview</p>
              <h1 className="text-3xl font-heading font-black text-headings tracking-tight">
                Welcome, {currentUser?.username || 'Athlete'}
              </h1>
            </div>
          </div>

          {/* Dashboard Right Side: Actions */}

          {/* Dashboard Right Side: Actions */}
          <div className="flex flex-wrap gap-4 items-center mt-6 md:mt-0 ml-21 md:ml-0">

            <DataExport />
   <Link to="/library" className="text-bodyText hover:text-primary transition-colors">Library</Link>
              <Link to="/community" className="text-bodyText hover:text-primary transition-colors">Community</Link>
            <Link to="/profile" className="text-sm font-semibold text-bodyText hover:text-primary transition-colors">
              Settings
            </Link>
            <div className="w-px h-4 bg-gray-800"></div>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-bodyText hover:text-red-500 transition-colors"
            >
              Sign Out
            </button>

          </div>

        </motion.div>


        {/* Analytics & Shortcuts Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* Left: Recharts Data Visualization */}
          <div className="col-span-1 lg:col-span-2 bg-darkCard border border-gray-800 rounded-3xl p-6 md:p-8 shadow-lg flex flex-col">
            <h3 className="text-xl font-heading font-black text-headings tracking-tight mb-2">
              7-Day Output Volume
            </h3>
            <p className="text-xs text-gray-400 font-medium mb-6">
              Total exercises executed over the last week.
            </p>

            <div className="flex-grow w-full min-h-[220px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorExercises" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="day" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#f3f4f6' }}
                      itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="exercises" name="Exercises" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorExercises)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Right: Stats + Nutrition + Body Metrics */}
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">

            {/* Quick Stat Card */}
            <div className="bg-darkCard border border-gray-800 rounded-3xl p-5 shadow-lg flex-1 flex flex-col justify-center relative overflow-hidden min-h-[110px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Today's Routines
                </p>
                <p className="text-4xl font-heading font-black text-headings mb-1">
                  {workouts.length}
                </p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                  {isToday ? "Tracking Live" : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Nutrition Card */}
            <Link
              to="/nutrition"
              className="group relative bg-darkCard border border-gray-800 rounded-3xl p-5 hover:border-primary/40 shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300 overflow-hidden flex-1 flex flex-col justify-center min-h-[110px]"
            >
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-heading font-black text-headings">Nutrition</h3>
                </div>
                <p className="text-bodyText text-[11px] font-medium leading-relaxed">
                  Log meals, track macros, and monitor progression.
                </p>
              </div>

              <div className="absolute bottom-4 right-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                →
              </div>
            </Link>

            {/* Body Metrics Card */}
            <Link
              to="/metrics"
              className="group relative bg-darkCard border border-gray-800 rounded-3xl p-5 hover:border-primary/40 shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300 overflow-hidden flex-1 flex flex-col justify-center min-h-[110px]"
            >
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19V5m0 14h16M8 15v-3m4 3V8m4 7V5"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-heading font-black text-headings">Body Metrics</h3>
                </div>
                <p className="text-bodyText text-[11px] font-medium leading-relaxed">
                  Track your weight, body measurements, and progress.
                </p>
              </div>

              <div className="absolute bottom-4 right-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                →
              </div>
            </Link>

          </div>
        </motion.div>


        {/* WORKOUTS ACTION BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-heading font-black text-headings tracking-tight">Daily Log</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">

            {/* Time Machine */}
            <div className="inline-flex items-center bg-darkCard border border-gray-800 rounded-lg p-1 shadow-lg">
              <button onClick={handlePrevDay} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-800 text-bodyText hover:text-headings transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>

              <div className="px-4 text-center min-w-[100px]">
                <p className="text-headings font-bold text-sm tracking-wide mt-1">
                  {isToday ? "Today" : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                {!isToday && (
                  <button onClick={handleGoToToday} className="text-[9px] text-primary font-bold uppercase tracking-wider hover:text-orange-400 mt-0.5 leading-none">
                    Back to Today
                  </button>
                )}
              </div>

              <button onClick={handleNextDay} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-800 text-bodyText hover:text-headings transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>

            <Link
              to="/create-workout"
              state={{ dateString: dateString }}
              className="bg-primary hover:bg-orange-500 text-headings font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] text-sm whitespace-nowrap flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Log Routine
            </Link>
          </div>
        </div>

        {/* Workouts Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Data...</p>
          </div>
        ) : workouts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-16 bg-darkCard rounded-3xl border border-dashed border-gray-800">
            <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <p className="text-headings font-bold text-lg mb-1">No Activity Found</p>
            <p className="text-bodyText text-sm">No routines have been logged for {isToday ? "today" : "this specific date"}.</p>
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workouts.map((workout) => {
              const isExpanded = expandedCards[workout._id];

              return (
                <motion.div key={workout._id} variants={item} className="bg-darkCard p-6 rounded-3xl border border-gray-800 shadow-lg hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] hover:border-primary/40 transition-all duration-300 group flex flex-col">

                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-primary mb-1 block">{workout.category}</span>
                      <h3 className="text-xl text-headings font-heading font-black leading-tight">{workout.title}</h3>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link to={`/edit-workout/${workout._id}`} className="p-1.5 text-gray-500 hover:text-headings bg-darkBg hover:bg-gray-800 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </Link>
                      <button onClick={() => handleDelete(workout._id)} className="p-1.5 text-gray-500 hover:text-red-500 bg-darkBg hover:bg-red-500/10 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>

                  <div className="mb-2 flex-grow bg-darkBg/50 rounded-2xl p-4 border border-gray-800/50">
                    <div className="space-y-3">
                      {workout.exercises.slice(0, 3).map((ex, index) => (
                        <div key={index} className="flex justify-between items-center text-sm border-b border-gray-800 last:border-0 pb-2 last:pb-0">
                          <span className="text-bodyText font-medium">{ex.name}</span>
                          <span className="text-headings font-semibold tracking-wide">
                            {ex.exerciseType === 'Cardio' ? (
                              <>{ex.duration}m {ex.distance && <span className="text-gray-500 text-xs">@ {ex.distance}</span>}</>
                            ) : (
                              <>{ex.sets}×{ex.reps} {ex.weight && <span className="text-gray-500 text-xs">@ {ex.weight}</span>}</>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="space-y-3 pt-3 mt-3 border-t border-gray-800">
                            {workout.exercises.slice(3).map((ex, index) => (
                              <div key={index + 3} className="flex justify-between items-center text-sm border-b border-gray-800 last:border-0 pb-2 last:pb-0">
                                <span className="text-bodyText font-medium">{ex.name}</span>
                                <span className="text-headings font-semibold tracking-wide">
                                  {ex.exerciseType === 'Cardio' ? (
                                    <>{ex.duration}m {ex.distance && <span className="text-gray-500 text-xs">@ {ex.distance}</span>}</>
                                  ) : (
                                    <>{ex.sets}×{ex.reps} {ex.weight && <span className="text-gray-500 text-xs">@ {ex.weight}</span>}</>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {workout.exercises.length > 3 && (
                    <button onClick={() => toggleExpand(workout._id)} className="w-full text-[10px] text-primary hover:text-orange-400 text-center pt-3 font-black uppercase tracking-widest transition-colors focus:outline-none">
                      {isExpanded ? 'Hide Details' : `Expand ${workout.exercises.length - 3} More Exercises`}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;