import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const { auth } = useContext(AuthContext);

  const bookingCategories = [
    {
      id: 'movies',
      path: '/movies',
      title: 'Movies',
      description: 'Book your favorite movie tickets',
      icon: '🎬',
      gradient: 'from-red-500 via-pink-500 to-rose-500',
      lightGradient: 'from-red-50 to-pink-50',
    },
    {
      id: 'trains',
      path: '/trains',
      title: 'Trains',
      description: 'Fast and comfortable rail journeys',
      icon: '🚂',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      lightGradient: 'from-blue-50 to-cyan-50',
    },
    {
      id: 'buses',
      path: '/buses',
      title: 'Buses',
      description: 'Affordable intercity bus travel',
      icon: '🚌',
      gradient: 'from-orange-500 via-yellow-500 to-amber-500',
      lightGradient: 'from-orange-50 to-yellow-50',
    },
    {
      id: 'hotels',
      path: '/hotels',
      title: 'Hotels',
      description: 'Stay in comfort and luxury',
      icon: '🏨',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      lightGradient: 'from-green-50 to-emerald-50',
    },
    {
      id: 'flights',
      path: '/flights',
      title: 'Flights',
      description: 'Fly anywhere, anytime',
      icon: '✈️',
      gradient: 'from-sky-500 via-blue-500 to-indigo-500',
      lightGradient: 'from-sky-50 to-indigo-50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"></div>
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[100px]"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-600/20 blur-[100px]"></div>
        </div>
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="text-center">
            <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">BOOKNGO</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 font-light">
              Book movies, trains, buses, hotels, and flights all in one place. Seamless, secure, and extraordinary.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10 text-slate-200 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                ✨ Book instantly
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10 text-slate-200 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                🔒 100% Secure
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10 text-slate-200 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                💰 Best Prices
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm font-medium mb-2 tracking-widest">WELCOME,</p>
              <p className="text-3xl font-bold text-white">
                {auth?.user?.firstName} {auth?.user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2 tracking-widest">EMAIL</p>
              <p className="text-white font-semibold text-lg">{auth?.user?.email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2 tracking-widest">PHONE</p>
              <p className="text-white font-semibold text-lg">{auth?.user?.phone}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2 tracking-widest">MEMBER SINCE</p>
              <p className="text-white font-semibold text-lg">Today</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Categories */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What would you like to book?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Choose from our wide range of services and book your next adventure
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {bookingCategories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link to={category.path}>
                <div
                  className="h-[300px] group relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] cursor-pointer border border-white/5 bg-slate-800/50 backdrop-blur-sm"
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-between z-10">
                    <div>
                      <div className="text-6xl mb-6 transform group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-500 origin-left drop-shadow-2xl">
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{category.title}</h3>
                      <p className="text-slate-400 group-hover:text-white/90 transition-colors duration-300 font-light">{category.description}</p>
                    </div>

                    <div className="flex items-center text-blue-400 group-hover:text-white font-bold group-hover:translate-x-2 transition-all duration-300">
                      Book Now <span className="ml-2">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Offers Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">Special Offers</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Limited Time Deals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '50% Off Movies', desc: 'On your first booking', color: 'from-pink-500 via-red-500 to-yellow-500' },
            { title: 'Free Train Booking', desc: 'Upto ₹500 cashback', color: 'from-cyan-500 via-blue-500 to-indigo-500' },
            { title: '20% Hotel Cashback', desc: 'On bookings above ₹5000', color: 'from-emerald-500 via-green-500 to-teal-500' },
          ].map((offer, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`bg-gradient-to-br ${offer.color} rounded-3xl p-8 text-white overflow-hidden relative cursor-pointer shadow-2xl`}
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-3">{offer.title}</h3>
                <p className="text-white/90 mb-8 text-lg font-medium">{offer.desc}</p>
                <button className="bg-white text-slate-900 font-bold px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300">
                  Claim Offer →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 py-16 mt-20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                BOOKNGO
              </p>
              <p className="text-slate-400 leading-relaxed">Your trusted, extraordinary booking companion for all your travels and entertainment.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider">Services</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Movies</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Trains</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Buses</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-slate-500 font-medium">
            <p>© 2026 BOOKNGO. All rights reserved. | Crafted with passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;