import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';
import { AuthContext } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const Buses = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBuses();
      setBuses(response.data.buses || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (bus) => {
    try {
      const bookingData = {
        busId: bus._id,
        seats: selectedSeats,
        travelDate: new Date()
      };

      const response = await bookingService.bookBus(bookingData);
      const booking = response.data.booking;

      setPaymentBooking({
        _id: booking._id,
        bookingType: 'bus',
        quantity: selectedSeats,
        totalPrice: response.data.totalPrice,
        userEmail: auth.user?.email
      });

      setSelectedBus(null);
    } catch (error) {
      console.error('Booking error:', error);
      alert(`❌ ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePaymentSuccess = () => {
    alert('✅ Booking confirmed! Check your booking history.');
    fetchBuses();
    setPaymentBooking(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-5xl mb-4">🚌</div>
            <p className="text-gray-600">Loading buses...</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="absolute left-6 top-6 bg-white text-gray-800 px-4 py-2 rounded-lg border border-white/30 hover:bg-white/90 transition"
          >
            ← Back
          </button>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-center">
            🚌 Book Bus Tickets
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl text-center mx-auto">
            {buses.length} buses available. Your comfortable journey begins here!
          </p>
        </div>
      </div>

      {/* Buses List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {buses.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No buses available</div>
        ) : (
          <div className="space-y-4">
            {buses.map((bus) => {
              const seatsLeft = bus.availableSeats;

              return (
                <div key={bus._id} className="bg-white rounded-2xl p-6 border hover:shadow-xl transition">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Info */}
                    <div>
                      <h3 className="text-xl font-bold">{bus.name}</h3>
                      <p className="text-sm text-gray-500">{bus.operator}</p>
                      <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700 capitalize inline-block mt-1">
                        {bus.busType}
                      </span>
                    </div>

                    {/* From */}
                    <div className="text-center">
                      <p className="font-bold">{bus.from}</p>
                      <p className="text-sm text-gray-500">{bus.departureTime}</p>
                      <p className="text-xs text-gray-400">Departure</p>
                    </div>

                    {/* Duration */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-semibold">{bus.duration}</p>
                      <div className="flex items-center justify-center my-1">
                        <div className="h-px bg-gray-300 w-8"></div>
                        <span className="mx-2 text-xl">🚌</span>
                        <div className="h-px bg-gray-300 w-8"></div>
                      </div>
                    </div>

                    {/* To */}
                    <div className="text-center">
                      <p className="font-bold">{bus.to}</p>
                      <p className="text-sm text-gray-500">{bus.arrivalTime}</p>
                      <p className="text-xs text-gray-400">Arrival</p>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{bus.price?.toLocaleString()}
                      </p>
                      <p className="text-sm text-yellow-500 font-semibold">⭐ {bus.rating}</p>
                      <p className="text-xs text-gray-400">{seatsLeft} seats left</p>
                    </div>

                    {/* Booking Section */}
                    <div>
                      {selectedBus === bus._id ? (
                        <div className="space-y-2">
                          <input
                            type="number"
                            min="1"
                            max={seatsLeft}
                            value={selectedSeats}
                            onChange={(e) => setSelectedSeats(parseInt(e.target.value))}
                            className="w-full border px-3 py-2 rounded text-sm"
                          />
                          <p className="text-sm text-gray-600 text-center font-medium">
                            Total: ₹{bus.price * selectedSeats}
                          </p>
                          <button
                            onClick={() => handleBook(bus)}
                            className="w-full bg-green-600 text-white py-2 rounded text-sm font-semibold"
                          >
                            Proceed to Payment
                          </button>
                          <button
                            onClick={() => setSelectedBus(null)}
                            className="w-full bg-gray-300 py-2 rounded text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedBus(bus._id)}
                          className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-transform hover:scale-105"
                        >
                          Book Now →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  {bus.amenities && bus.amenities.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                      {bus.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
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

export default Buses;