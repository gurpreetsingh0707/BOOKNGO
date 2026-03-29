import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Hotels = () => {
  const navigate = useNavigate();

  const hotels = [
    { id: 1, name: 'Taj Palace', city: 'Delhi', price: 5000, rating: 4.9, rooms: 'Luxury' },
    { id: 2, name: 'The Oberoi', city: 'Mumbai', price: 6000, rating: 4.8, rooms: '5-Star' },
    { id: 3, name: 'ITC Hotels', city: 'Bangalore', price: 4000, rating: 4.7, rooms: '4-Star' },
    { id: 4, name: 'Comfort Inn', city: 'Delhi', price: 2000, rating: 4.5, rooms: '3-Star' },
  ];

  const handleBooking = (hotel) => {
    alert(`Booking ${hotel.name} in ${hotel.city} for ₹${hotel.price} per night...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="absolute left-6 top-6 bg-white text-gray-800 px-4 py-2 rounded-lg border border-white/30 hover:bg-white/90 transition"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold mt-4">🏨 Book Hotels</h1>
          <p className="text-green-100 mt-2">Find & book your perfect stay</p>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 h-40 flex items-center justify-center text-6xl">
                🏨
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-3">📍 {hotel.city}</p>
                <p className="text-sm text-gray-700 mb-3">{hotel.rooms} Rooms</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-green-600">₹{hotel.price}</span>
                  <span className="text-yellow-500">⭐ {hotel.rating}</span>
                </div>
                <button
                  onClick={() => handleBooking(hotel)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition"
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

export default Hotels;