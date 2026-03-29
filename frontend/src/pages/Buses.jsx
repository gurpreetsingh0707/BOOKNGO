import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Buses = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const buses = [
    { id: 1, name: 'Volvo AC', from: 'Delhi', to: 'Jaipur', price: 600, time: '5h', rating: 4.5 },
    { id: 2, name: 'State Bus', from: 'Delhi', to: 'Chandigarh', price: 400, time: '6h', rating: 4.3 },
    { id: 3, name: 'Deluxe Coach', from: 'Mumbai', to: 'Pune', price: 700, time: '4h 30m', rating: 4.6 },
    { id: 4, name: 'Premium Sleeper', from: 'Delhi', to: 'Goa', price: 1500, time: '28h', rating: 4.7 },
  ];

  const handleBooking = (bus) => {
    alert(`Booking ${bus.name}: ${bus.from} → ${bus.to} for ₹${bus.price}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="  relative bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-6 top-6 bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold">🚌 Book Bus Tickets</h1>
          <p className="text-orange-100 mt-2">Comfortable & budget-friendly bus travel</p>
        </div>
      </div>

      {/* Buses Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 h-40 flex items-center justify-center text-6xl">
                🚌
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{bus.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{bus.from} → {bus.to}</p>
                <p className="text-sm text-gray-600 mb-3">⏱️ {bus.time}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-orange-600">₹{bus.price}</span>
                  <span className="text-yellow-500">⭐ {bus.rating}</span>
                </div>
                <button
                  onClick={() => handleBooking(bus)}
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition"
                >
                  Book Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buses;