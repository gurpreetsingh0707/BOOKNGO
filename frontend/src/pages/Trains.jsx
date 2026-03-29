import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Trains = () => {
  const navigate = useNavigate();

  const trains = [
    { id: 1, name: 'Rajdhani Express', from: 'Delhi', to: 'Mumbai', price: 1500, time: '16h 30m', rating: 4.6 },
    { id: 2, name: 'Shatabdi Express', from: 'Delhi', to: 'Chandigarh', price: 800, time: '4h 30m', rating: 4.7 },
    { id: 3, name: 'Garib Rath', from: 'Delhi', to: 'Chennai', price: 1200, time: '28h', rating: 4.5 },
    { id: 4, name: 'Premium Express', from: 'Mumbai', to: 'Bangalore', price: 2000, time: '14h', rating: 4.8 },
  ];

  const handleBooking = (train) => {
    alert(`Booking ${train.name}: ${train.from} → ${train.to} for ₹${train.price}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="  relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-6 top-6 bg-white text-gray-800 px-4 py-2 rounded-lg border border-white/30 hover:bg-white/90 transition"
          >
            ← Back 
          </button>
          <h1 className="text-4xl font-bold">🚂 Book Train Tickets</h1>
          <p className="text-blue-100 mt-2">Fast & affordable rail travel across India</p>
        </div>
      </div>

      {/* Trains List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {trains.map((train) => (
            <div key={train.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{train.name}</h3>
                  <p className="text-gray-600">🚂 Train</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-800">{train.from}</p>
                  <p className="text-gray-600">From</p>
                </div>
                <div className="text-center text-gray-600">
                  <p className="text-2xl">→</p>
                  <p className="text-sm">{train.time}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-800">{train.to}</p>
                  <p className="text-gray-600">To</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">₹{train.price}</p>
                  <p className="text-yellow-500">⭐ {train.rating}</p>
                  <button
                    onClick={() => handleBooking(train)}
                    className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition w-full"
                  >
                    Book →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trains;