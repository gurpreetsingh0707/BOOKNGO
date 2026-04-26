import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Movies from './Movies';

const Shows = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movie');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'movie', label: 'Movies', icon: '🎬' },
    { id: 'live_show', label: 'Live Shows', icon: '🎭' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-slate-900 overflow-hidden">
      <Navbar />

      {/* Dynamic Header */}
      <div className="relative overflow-hidden py-16 sm:py-20 transition-colors duration-500">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[120px] transition-colors duration-1000 ${
            activeTab === 'movie' ? 'bg-red-600/10' : 'bg-purple-600/10'
          }`}></div>
          <div className={`absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[100px] transition-colors duration-1000 ${
            activeTab === 'movie' ? 'bg-orange-600/10' : 'bg-pink-600/10'
          }`}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="absolute left-6 top-0 bg-white/40 hover:bg-white/60 text-slate-800 p-2.5 rounded-full border border-slate-200 backdrop-blur-md transition-all flex items-center justify-center group shadow-md hover:shadow-lg z-20"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          <motion.h1 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-900 mb-8"
          >
            {activeTab === 'movie' ? "🎬 Movie Tickets" : "🎭 Live Shows"}
          </motion.h1>

          <div className="flex flex-col items-center justify-center gap-6 max-w-4xl mx-auto mt-8">
            <div className="flex bg-slate-200/50 backdrop-blur-md p-1.5 rounded-full border border-slate-300 shadow-lg">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-3 px-8 rounded-full text-lg font-bold transition-colors ${
                      isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="shows-tab-indicator"
                        className="absolute inset-0 bg-slate-900 rounded-full shadow-md"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <input
                type="text"
                placeholder={`Search for ${activeTab === 'movie' ? 'movies or languages' : 'events, artists or venues'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 pl-12 pr-4 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-slate-400 shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Movies category={activeTab} searchTerm={searchTerm} />
        </motion.div>
      </div>
    </div>
  );
};

export default Shows;
