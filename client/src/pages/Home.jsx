import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  
  const slideRight = { 
    hidden: { opacity: 0, x: -60 }, 
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } 
  };

  return (
    <div className="font-sans overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden">
        
        {/* 1. Dynamic Video Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
          >
            <source src="/videos/hero-workout.mp4" type="video/mp4" />
            <img src="/images/gym1.jpeg" alt="Gym" className="w-full h-full object-cover" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/90 to-transparent w-full md:w-3/4 lg:w-2/3"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-darkBg/30 via-transparent to-darkBg"></div>
        </div>

        {/* 2. The Brand Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
        
        {/* 3. The Hero Content */}
        <motion.div 
          initial="hidden" 
          animate="show" 
          transition={{ staggerChildren: 0.15, delayChildren: 0.2 }} 
          className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2"
        >
          <div className="flex flex-col items-start text-left">
            <motion.div variants={slideRight} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-darkCard/50 backdrop-blur-md border border-gray-800 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Ark Fitness is Live</span>
            </motion.div>

            <motion.h1 variants={slideRight} className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-headings tracking-tighter mb-4 leading-[0.95]">
              TRACK <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">EVERY</span> <br />
              REP.
            </motion.h1>

            <motion.p variants={slideRight} className="text-bodyText text-base md:text-lg max-w-md mb-8 font-medium leading-relaxed border-l-4 border-primary pl-5">
              The premium platform for strength and cardio. Ditch the messy notebooks, visualize your progression, and train with absolute precision.
            </motion.p>

            <motion.div variants={slideRight} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {user ? (
                <Link to="/dashboard" className="bg-primary hover:bg-orange-500 text-headings font-black py-4 px-8 rounded-xl transition-all duration-300 tracking-wider flex items-center justify-center gap-3 group">
                  ENTER DASHBOARD
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              ) : (
                <Link to="/register" className="bg-headings text-darkBg hover:bg-primary hover:text-headings font-black py-4 px-8 rounded-xl transition-all duration-300 tracking-wider flex items-center justify-center gap-3 group">
                  START TRACKING FREE
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SPLIT SECTION */}
      <section className="py-24 bg-darkBg relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 blur-[80px] rounded-full"></div>
            <motion.img 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              src="/images/gym2.jpeg" 
              alt="Athlete training focused" 
              className="relative z-10 w-full aspect-[4/5] object-cover rounded-3xl border border-gray-800 shadow-2xl"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <span className="text-primary text-xs font-black tracking-[0.3em] uppercase mb-4 block">
              Built For Focus
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-headings tracking-tight mb-6">
              FOCUS ON THE LIFT.<br/>
              <span className="text-primary">WE HANDLE THE REST.</span>
            </h2>
            <p className="text-bodyText text-lg leading-relaxed mb-8">
              You shouldn't need a manual to track your workouts. Ark Fitness uses a clean, intuitive dark-mode interface that lets you record your sets in seconds, directly from the gym floor.
            </p>
            
            <ul className="space-y-5">
              {[
                'No bloated social feeds or distractions', 
                'Dynamic schema for heavy lifting and cardio', 
                'Instant analytics and progression charts'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-headings font-medium">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20">
                    ✓
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-darkCard border-y border-gray-800/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-headings tracking-tight mb-4">EVERYTHING YOU NEED.</h2>
            <p className="text-bodyText font-medium text-lg">Zero bloat. Just the tools required for progression.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-darkBg p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-headings mb-3">Lightning Fast Logging</h3>
              <p className="text-bodyText text-sm leading-relaxed">Our UI is designed to get out of your way. Log complex sets, reps, and weights between resting periods without breaking focus.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-darkBg p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-headings mb-3">Mixed Modality</h3>
              <p className="text-bodyText text-sm leading-relaxed">Heavy lifting? Treadmill runs? Our dynamic schema handles Strength and Cardio in the exact same routine effortlessly.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-darkBg p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-headings mb-3">100% Data Security</h3>
              <p className="text-bodyText text-sm leading-relaxed">Your data is secured with industry-standard JWT authentication and encrypted passwords. Your progression belongs to you.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT & CONTACT SECTIONS */}
      <section className="py-24 bg-darkBg relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* About Us Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="bg-darkCard p-10 lg:p-14 rounded-3xl border border-gray-800 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            <h3 className="text-3xl md:text-4xl font-heading font-black text-headings tracking-tight mb-4 relative z-10">
              WHO WE <span className="text-primary">ARE.</span>
            </h3>
            <p className="text-bodyText text-lg mb-8 leading-relaxed relative z-10">
              Built by athletes, for athletes. We were tired of bloated apps and messy notebooks. Ark Fitness was forged to provide a raw, data-driven approach to progression.
            </p>
            <Link to="/about" className="inline-flex items-center gap-3 text-headings font-bold uppercase tracking-widest text-sm hover:text-primary transition-colors relative z-10 group/link w-max">
              Discover Our Story
              <svg className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </motion.div>

          {/* Contact Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.1 }}
            className="bg-darkCard p-10 lg:p-14 rounded-3xl border border-gray-800 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/10 transition-colors"></div>
            <h3 className="text-3xl md:text-4xl font-heading font-black text-headings tracking-tight mb-4 relative z-10">
              GET IN <span className="text-primary">TOUCH.</span>
            </h3>
            <p className="text-bodyText text-lg mb-8 leading-relaxed relative z-10">
              Got a question, a feature request, or need support? We are always listening. Drop us a line and let's build the ultimate tracking platform together.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-3 text-headings font-bold uppercase tracking-widest text-sm hover:text-primary transition-colors relative z-10 group/link w-max">
              Contact Support
              <svg className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-heading font-black text-headings tracking-tight mb-6">READY TO LEVEL UP?</h2>
          <p className="text-bodyText text-lg mb-10 max-w-xl mx-auto">Join the athletes who have already ditched the notebook. Setup takes less than 30 seconds.</p>
          {user ? (
            <Link to="/dashboard" className="inline-block bg-headings text-darkBg hover:bg-primary hover:text-headings font-black py-4 px-12 rounded-xl transition-all duration-300 tracking-widest uppercase shadow-xl text-lg">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="inline-block bg-headings text-darkBg hover:bg-primary hover:text-headings font-black py-4 px-12 rounded-xl transition-all duration-300 tracking-widest uppercase shadow-xl text-lg">
              Create Free Account
            </Link>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;