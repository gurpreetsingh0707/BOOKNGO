import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Flights from './Flights';
import Trains from './Trains';
import Buses from './Buses';

const Travel = () => {
  const [activeTab, setActiveTab] = useState('flights');

  const tabs = [
    { id: 'flights', label: 'Flights', icon: '✈️' },
    { id: 'trains', label: 'Trains', icon: '🚂' },
    { id: 'buses', label: 'Buses', icon: '🚌' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <Navbar />

      {/* Dynamic Header based on active tab */}
      <div className="relative overflow-hidden py-16 sm:py-20 transition-colors duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[120px] transition-colors duration-1000 ${
            activeTab === 'flights' ? 'bg-sky-600/20' : activeTab === 'trains' ? 'bg-blue-600/20' : 'bg-orange-600/20'
          }`}></div>
          <div className={`absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[100px] transition-colors duration-1000 ${
            activeTab === 'flights' ? 'bg-indigo-600/20' : activeTab === 'trains' ? 'bg-cyan-600/20' : 'bg-yellow-600/20'
          }`}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.h1 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-black text-white mb-8"
          >
            {activeTab === 'flights' && "✈️ Book Flights"}
            {activeTab === 'trains' && "🚂 Book Trains"}
            {activeTab === 'buses' && "🚌 Book Buses"}
          </motion.h1>

          {/* Tab Selector */}
          <div className="flex justify-center max-w-lg mx-auto bg-slate-800/50 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 py-3 px-4 rounded-full text-lg font-bold transition-colors ${
                    isActive ? 'text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="travel-tab-indicator"
                      className="absolute inset-0 bg-white rounded-full shadow-md"
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
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'flights' && <Flights />}
          {activeTab === 'trains' && <Trains />}
          {activeTab === 'buses' && <Buses />}
        </motion.div>
      </div>
    </div>
  );
};

export default Travel;
