import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10 opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
             
              <span className="text-gray-900">BOOKNGO</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Book movies, trains, buses, and hotels all in one place. Seamless, secure, and affordable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="bg-white/80 backdrop-blur-md rounded-full px-8 py-3 border border-white/20 text-gray-700 font-semibold">
                ✨ Book instantly
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-full px-8 py-3 border border-white/20 text-gray-700 font-semibold">
                🔒 100% Secure
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-full px-8 py-3 border border-white/20 text-gray-700 font-semibold">
                💰 Best Prices
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-md rounded-3xl p-8 border border-white/30 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm font-medium mb-2">WELCOME,</p>
              <p className="text-2xl font-bold text-gray-900">
                {auth?.user?.firstName} {auth?.user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">EMAIL</p>
              <p className="text-gray-900 font-semibold">{auth?.user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">PHONE</p>
              <p className="text-gray-900 font-semibold">{auth?.user?.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">MEMBER SINCE</p>
              <p className="text-gray-900 font-semibold">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What would you like to book?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of services and book your next adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookingCategories.map((category, index) => (
            <Link key={category.id} to={category.path}>
              <div
                className="h-full group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

                {/* Content */}
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div>
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-white/90">{category.description}</p>
                  </div>

                  <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Book Now <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Offers Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Special Offers</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Limited Time Deals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '50% Off Movies', desc: 'On your first booking', color: 'from-red-500 to-pink-500' },
            { title: 'Free Train Booking', desc: 'Upto ₹500 cashback', color: 'from-blue-500 to-cyan-500' },
            { title: '20% Hotel Cashback', desc: 'On bookings above ₹5000', color: 'from-green-500 to-emerald-500' },
          ].map((offer, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${offer.color} rounded-2xl p-8 text-white overflow-hidden group cursor-pointer`}>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                <p className="text-white/90 mb-6">{offer.desc}</p>
                <button className="bg-white text-gray-900 font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                  Claim Offer →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-gradient-to-b from-white to-gray-50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                BOOKNGO
              </p>
              <p className="text-gray-600">Your trusted booking companion</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Movies</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Trains</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Buses</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-gray-600">
            <p>© 2026 BOOKNGO. All rights reserved. | Made with hand</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;