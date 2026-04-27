import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';
import { AuthContext } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const Hotels = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => 
      hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [hotels, searchTerm]);

  useEffect(() => {
    fetchHotels();
    const today = new Date().toISOString().split('T')[0];
    setCheckIn(today);
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllHotels();
      setHotels(response.data.hotels || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (hotel) => {
    if (!checkIn || !checkOut) {
      toast.warning('Please select check-in and check-out dates');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.warning('Check-out date must be after check-in date');
      return;
    }

    try {
      const bookingData = {
        hotelId: hotel._id,
        rooms: selectedRooms,
        checkInDate: checkIn,
        checkOutDate: checkOut
      };

      const response = await bookingService.bookHotel(bookingData);
      const booking = response.data.booking;

      const nights = Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = hotel.pricePerNight * selectedRooms * nights;

      setPaymentBooking({
        _id: booking._id,
        bookingType: 'hotel',
        quantity: selectedRooms,
        totalPrice,
        userEmail: auth.user?.email
      });

      setSelectedHotel(null);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(`❌ ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('✅ Booking confirmed! Check your booking history.');
    fetchHotels();
    setPaymentBooking(null);
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const nights = Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
      );
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-5xl mb-4">🏨</div>
            <p className="text-gray-600">Loading hotels...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="absolute left-6 top-6 bg-white/10 hover:bg-white/20 text-slate-800 p-2 rounded-full border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center group shadow-md hover:shadow-lg"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-center mt-8">
            🏨 Book Hotels
          </h1>

          <div className="max-w-2xl mx-auto mt-8 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search hotels by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/60 backdrop-blur-md border border-white/40 text-gray-800 pl-12 pr-4 py-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg placeholder-gray-500"
              />
            </div>
          </div>

          <p className="text-lg text-gray-600 mt-6 text-center mx-auto">
            {filteredHotels.length} hotels available. Stay in comfort and luxury!
          </p>
        </div>
      </div>

      {/* Hotels List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {filteredHotels.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
            No hotels match your search.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHotels.map((hotel) => {
              const roomsLeft = hotel.availableRooms;

              return (
                <div key={hotel._id} className="bg-white rounded-2xl p-6 border hover:shadow-xl transition">
                  {selectedHotel === hotel._id ? (
                    /* Expanded Booking View */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{hotel.name}</h3>
                          <p className="text-gray-500">📍 {hotel.city} • {hotel.category}</p>
                        </div>
                        <p className="text-gray-600 text-sm">{hotel.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400">Room Type</p>
                            <p className="font-semibold capitalize text-gray-800">{hotel.roomType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Rating</p>
                            <p className="font-semibold text-yellow-500">⭐ {hotel.rating}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Available</p>
                            <p className="font-semibold text-green-600">{roomsLeft} rooms</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Contact</p>
                            <p className="font-semibold text-gray-800 text-sm">{hotel.phone}</p>
                          </div>
                        </div>

                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-2">Amenities</p>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.map((amenity, idx) => (
                                <span key={idx} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Booking Form */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl font-bold text-purple-600">₹{hotel.pricePerNight}</span>
                          <span className="text-xs text-gray-500">/ night</span>
                        </div>
                        
                        <div>
                          <label className="text-gray-600 text-xs font-semibold">Rooms</label>
                          <input
                            type="number"
                            min="1"
                            max={roomsLeft}
                            value={selectedRooms}
                            onChange={(e) => setSelectedRooms(parseInt(e.target.value))}
                            className="w-full border px-3 py-2 rounded text-sm mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-gray-600 text-xs font-semibold">Check-in</label>
                            <input
                              type="date"
                              value={checkIn}
                              onChange={(e) => setCheckIn(e.target.value)}
                              className="w-full border px-2 py-2 rounded text-xs mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-gray-600 text-xs font-semibold">Check-out</label>
                            <input
                              type="date"
                              value={checkOut}
                              onChange={(e) => setCheckOut(e.target.value)}
                              className="w-full border px-2 py-2 rounded text-xs mt-1"
                            />
                          </div>
                        </div>

                        {checkIn && checkOut && calculateNights() > 0 && (
                          <div className="bg-white border border-gray-200 rounded p-3 mt-2 text-sm">
                            <div className="flex justify-between text-gray-600 mb-1">
                              <span>₹{hotel.pricePerNight} × {selectedRooms} room × {calculateNights()} night</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 border-t pt-2 mt-1">
                              <span>Total</span>
                              <span>₹{hotel.pricePerNight * selectedRooms * calculateNights()}</span>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleBook(hotel)}
                          disabled={!checkIn || !checkOut || calculateNights() <= 0}
                          className="w-full bg-green-600 text-white py-2 rounded mt-2 text-sm font-semibold disabled:opacity-50"
                        >
                          Proceed to Payment
                        </button>
                        <button
                          onClick={() => setSelectedHotel(null)}
                          className="w-full bg-gray-300 py-2 rounded text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Compact List View */
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <h3 className="text-xl font-bold">{hotel.name}</h3>
                        <p className="text-sm text-gray-500">📍 {hotel.city}</p>
                        <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 capitalize inline-block mt-1">
                          {hotel.category}
                        </span>
                      </div>

                      <div className="text-center md:text-left">
                        <p className="text-sm text-gray-500">Room Type</p>
                        <p className="font-semibold capitalize text-gray-800">{hotel.roomType}</p>
                      </div>

                      <div className="text-center md:text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{hotel.pricePerNight?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per night</p>
                        <p className="text-sm text-yellow-500 font-semibold mt-1">⭐ {hotel.rating}</p>
                      </div>

                      <div>
                        <button
                          onClick={() => setSelectedHotel(hotel._id)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-transform hover:scale-105"
                        >
                          View Deals →
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-2">{roomsLeft} rooms left</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Hotels;