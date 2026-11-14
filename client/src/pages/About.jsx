import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' }
  }
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 }
  }
};

const values = [
  {
    number: '01',
    title: 'Simplicity First.',
    description: 'Your workout tracker should make training easier, not introduce another obstacle. We prioritize a clean, intuitive experience that lets you record exercises, sets, repetitions, and performance without unnecessary steps.',
    icon: '✳'
  },
  {
    number: '02',
    title: 'Progress Over Everything.',
    description: 'Real progress comes from consistency. Track your training history, monitor improvements, and use meaningful workout data to understand how far you have come and where you can improve.',
    icon: '↗'
  },
  {
    number: '03',
    title: 'Your Data, Your Journey.',
    description: 'Your fitness journey belongs to you. We believe your training information should be treated with care, transparency, and respect. Your personal progress should never become an afterthought.',
    icon: '◈'
  },
  {
    number: '04',
    title: 'Built for Every Athlete.',
    description: 'From beginners discovering the gym to experienced lifters refining their routines, Ark Fitness aims to support different training styles, fitness levels, and individual goals.',
    icon: '◎'
  }
];

const features = [
  {
    title: 'Workout Tracking',
    description: 'Record exercises, sets, repetitions, and weights with an organized workout logging experience.',
    tag: 'TRAIN SMARTER'
  },
  {
    title: 'Progress Monitoring',
    description: 'Keep track of your training history and identify improvements over time with meaningful data.',
    tag: 'SEE THE DIFFERENCE'
  },
  {
    title: 'Flexible Training',
    description: 'Whether your focus is strength training, hypertrophy, conditioning, or cardio, your training deserves a place.',
    tag: 'YOUR ROUTINE'
  }
];

const About = () => {
    const { user } = useContext(AuthContext);
  return (
    <main className="min-h-screen bg-darkBg text-bodyText font-sans overflow-hidden">

      {/* HERO WITH CINEMATIC BACKGROUND (gym3) */}
      <section className="relative pt-28 md:pt-40 pb-32 flex flex-col justify-center">
        
        

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-20 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="max-w-5xl"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-3 text-primary uppercase tracking-[0.3em] text-xs font-black mb-8">
                <span className="w-8 h-[2px] bg-primary" />
                THE STORY BEHIND ARK FITNESS
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-headings leading-[0.95] tracking-tighter mb-10 drop-shadow-xl"
            >
              YOUR JOURNEY.
              <br />
              YOUR DATA.
              <br />
              <span className="text-primary">YOUR PROGRESS.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-lg md:text-xl leading-relaxed text-bodyText/90 drop-shadow-md"
            >
              Ark Fitness is a workout tracking and fitness management
              platform built around one simple idea: making consistent
              progress should be easier. We bring your training,
              performance, and fitness journey together in one place.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap gap-4">
              <a
                href="#our-story"
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all"
              >
                Discover Our Story →
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-24 border-y border-gray-800 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 backdrop-blur-sm bg-darkBg/30"
          >
            {[
              ['01', 'TRAIN WITH PURPOSE'],
              ['02', 'TRACK YOUR JOURNEY'],
              ['03', 'GROW CONSISTENTLY']
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-4">
                <span className="text-primary font-black text-2xl">{number}</span>
                <span className="text-xs tracking-[0.2em] font-bold text-headings">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OUR STORY WITH INTEGRATED QUOTE BACKGROUND (gym4) */}
      <section id="our-story" className="py-28 bg-darkCard/30 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className="text-primary text-xs font-black tracking-[0.3em] uppercase">
                THE REASON WE EXIST
              </span>

              <h2 className="text-4xl md:text-5xl font-heading font-black text-headings mt-6 mb-8 tracking-tight">
                IT STARTED WITH A
                <span className="text-primary"> SIMPLE PROBLEM.</span>
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-bodyText/80">
                <p>
                  Fitness is built on consistency. Every workout, every
                  repetition, and every small improvement contributes
                  to something bigger. But keeping track of that progress
                  has not always been straightforward.
                </p>

                <p>
                  Traditional workout notebooks can become disorganized.
                  Spreadsheets are often inconvenient to use during
                  training, and many fitness applications introduce
                  unnecessary complexity into something that should
                  be simple.
                </p>

                <p>
                  We wanted a better way to approach workout management.
                  A platform where recording a workout feels effortless,
                  training information stays organized, and progress
                  becomes easier to understand.
                </p>

                <p className="text-headings font-semibold border-l-2 border-primary pl-6">
                  That idea became Ark Fitness: a fitness tracking
                  platform designed to put your training experience
                  and long-term progress first.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-5 bg-primary/10 blur-3xl rounded-full" />

              <div className="relative bg-darkBg border border-gray-800 rounded-[2rem] p-10 md:p-14 overflow-hidden group shadow-2xl">
                {/* Background Image Integration */}
                <img 
                  src="/images/gym4.jpeg" 
                  alt="Training focus" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 mix-blend-luminosity transition-opacity duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/80 to-transparent"></div>

                <div className="relative z-10">
                  <div className="text-primary text-7xl font-black mb-8">"</div>

                  <h3 className="text-3xl md:text-4xl font-heading font-black text-headings leading-tight mb-8">
                    SMALL IMPROVEMENTS.
                    <br />
                    <span className="text-primary">LASTING RESULTS.</span>
                  </h3>

                  <p className="text-bodyText/90 text-lg leading-relaxed">
                    You don't need to have everything figured out.
                    You just need a way to keep moving forward.
                    Every recorded workout becomes another piece
                    of your progress.
                  </p>

                  <div className="mt-10 pt-8 border-t border-gray-700">
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                      THE ARK FITNESS PHILOSOPHY
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* MISSION AND VISION WITH TEXTURED OVERLAY (gym5) */}
      <section className="py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <span className="text-primary text-xs font-black tracking-[0.3em] uppercase">
              WHAT DRIVES US
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-headings mt-5">
              OUR PURPOSE.
              <span className="text-primary"> OUR DIRECTION.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-darkCard border border-gray-800 rounded-3xl p-10 md:p-12 shadow-xl"
            >
              <span className="text-5xl text-primary">◎</span>
              <h3 className="text-3xl font-heading font-black text-headings mt-8 mb-5">
                OUR MISSION
              </h3>
              <p className="text-bodyText/80 leading-relaxed text-lg">
                To make fitness tracking more accessible, organized,
                and practical by providing a platform that helps
                individuals manage their workouts, understand their
                performance, and stay consistent with their goals.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="relative rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.15)] group"
            >
              <div className="absolute inset-0 bg-primary"></div>
              {/* Multiply Blend Background */}
              <img 
                src="/images/gym5.jpeg" 
                alt="Vision background" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:opacity-70 transition-opacity duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/60"></div>
              
              <div className="relative z-10 p-10 md:p-12 h-full flex flex-col justify-center">
                <span className="text-5xl text-white drop-shadow-md">✦</span>
                <h3 className="text-3xl font-heading font-black text-white mt-8 mb-5 drop-shadow-md">
                  OUR VISION
                </h3>
                <p className="text-white/95 leading-relaxed text-lg font-medium drop-shadow-md">
                  To create a fitness ecosystem where individuals
                  have the tools and information they need to take
                  ownership of their training, make informed decisions,
                  and build sustainable habits for long-term improvement.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-28 bg-darkCard/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <span className="text-primary text-xs font-black tracking-[0.3em] uppercase">
              THE PRINCIPLES WE FOLLOW
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-headings mt-5 mb-6">
              WHAT WE
              <span className="text-primary"> BELIEVE IN.</span>
            </h2>
            <p className="text-bodyText/70 text-lg leading-relaxed">
              Every decision behind Ark Fitness comes back to
              making the fitness experience better, more useful,
              and more focused on the individual.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <motion.article
                key={value.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group bg-darkCard border border-gray-800 hover:border-primary/50 rounded-3xl p-9 transition-colors duration-300 shadow-lg"
              >
                <div className="flex justify-between items-start mb-10">
                  <span className="text-primary text-4xl">{value.icon}</span>
                  <span className="text-gray-600 font-heading font-black text-xl">
                    {value.number}
                  </span>
                </div>

                <h3 className="text-2xl font-heading font-black text-headings mb-4 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>

                <p className="text-bodyText/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="text-primary text-xs font-black tracking-[0.3em] uppercase">
                THE PLATFORM
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-headings mt-5 mb-6">
                EVERYTHING YOU NEED
                <span className="text-primary"> TO KEEP MOVING.</span>
              </h2>
              <p className="text-bodyText/70 text-lg leading-relaxed">
                A more organized approach to managing your fitness
                routine. Ark Fitness brings essential training tools
                together to help you stay focused on what matters.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="bg-darkCard border border-gray-800 rounded-3xl p-9 hover:border-primary/50 transition-all duration-300 shadow-lg"
              >
                <span className="text-primary text-xs font-black tracking-[0.2em]">
                  {feature.tag}
                </span>

                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl mt-10 mb-8">
                  {['↗', '◈', '◎'][index]}
                </div>

                <h3 className="text-2xl font-heading font-black text-headings mb-4">
                  {feature.title}
                </h3>

                <p className="text-bodyText/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR WITH SPLIT PARALLAX (gym6) */}
      <section className="py-28 bg-darkCard/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 -left-32 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <span className="text-primary text-xs font-black tracking-[0.3em] uppercase block mb-4">
                MADE FOR THE JOURNEY
              </span>

              <h2 className="text-4xl md:text-5xl font-heading font-black text-headings mb-8">
                EVERY STARTING POINT.
                <br/>
                <span className="text-primary"> EVERY GOAL.</span>
              </h2>

              <p className="text-bodyText/80 text-lg leading-relaxed mb-6">
                Ark Fitness is designed for people who take their
                fitness journey seriously, regardless of where
                they currently stand. Whether you're stepping into
                the gym for the first time, building strength,
                pursuing muscle growth, or maintaining an established
                training routine, having a reliable way to track
                your workouts can make a meaningful difference.
              </p>

              <p className="text-bodyText/90 font-medium text-lg leading-relaxed border-l-2 border-primary pl-4">
                Your goals are individual. Your training is individual.
                Your approach to progress should be too.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="aspect-[4/3] w-full relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src="/images/gym6.jpeg" 
                  alt="Athlete focused on goal" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute w-96 h-96 bg-primary/10 blur-[120px] rounded-full top-0 left-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <span className="text-primary text-xs font-black tracking-[0.3em] uppercase">
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h2 className="text-5xl md:text-7xl font-heading font-black text-headings mt-8 mb-8 tracking-tighter">
            STOP GUESSING.
            <br />
            <span className="text-primary">START TRACKING.</span>
          </h2>

          <p className="text-bodyText/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Every workout counts. Every improvement matters.
            Make your training more organized, stay consistent,
            and give your progress the attention it deserves.
            Your journey is yours to build.
          </p>

          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-xl font-black uppercase tracking-wider hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all"
            >
              Continue Your Journey
              <span>→</span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-xl font-black uppercase tracking-wider hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all"
            >
              Start Your Journey
              <span>→</span>
            </Link>
          )}
        </motion.div>
      </section>

    </main>
  );
};

export default About;