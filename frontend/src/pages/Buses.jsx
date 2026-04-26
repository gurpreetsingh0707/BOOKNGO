import React, { useState, useEffect, useContext, useMemo } from 'react';
import PaymentModal from '../components/PaymentModal';
import { AuthContext } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const Buses = ({ searchTerm }) => {
  const { auth } = useContext(AuthContext);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);

  const filteredBuses = useMemo(() => {
    if (!searchTerm) return buses;
    const lowerSearch = searchTerm.toLowerCase();
    return buses.filter(b => 
      b.from?.toLowerCase().includes(lowerSearch) ||
      b.to?.toLowerCase().includes(lowerSearch) ||
      b.name?.toLowerCase().includes(lowerSearch) ||
      b.operator?.toLowerCase().includes(lowerSearch)
    );
  }, [buses, searchTerm]);

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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">🚌</div>
          <p className="text-slate-400">Searching buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Buses List */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="mb-6 flex justify-between items-center text-slate-300">
          <h2 className="text-2xl font-bold text-white">Available Buses</h2>
          <p>{filteredBuses.length} results found</p>
        </div>

        {filteredBuses.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-slate-800/30 rounded-2xl border border-white/5 backdrop-blur-sm">
            {searchTerm ? `No buses found matching "${searchTerm}"` : 'No buses available'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBuses.map((bus) => {
              const seatsLeft = bus.availableSeats;

              return (
                <div key={bus._id} className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300 hover:-translate-y-1">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Info */}
                    <div>
                      <h3 className="text-xl font-bold text-white">{bus.name}</h3>
                      <p className="text-sm text-slate-400">{bus.operator}</p>
                      <span className="px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 capitalize inline-block mt-2 font-medium">
                        {bus.busType}
                      </span>
                    </div>

                    {/* From */}
                    <div className="text-center">
                      <p className="font-bold text-lg text-white">{bus.from}</p>
                      <p className="text-sm text-slate-300">{bus.departureTime}</p>
                      <p className="text-xs text-slate-500">Departure</p>
                    </div>

                    {/* Duration */}
                    <div className="text-center">
                      <p className="text-sm text-slate-400 font-semibold">{bus.duration}</p>
                      <div className="flex items-center justify-center my-1">
                        <div className="h-[2px] bg-slate-700 w-8"></div>
                        <span className="mx-2 text-sm">🚌</span>
                        <div className="h-[2px] bg-slate-700 w-8"></div>
                      </div>
                    </div>

                    {/* To */}
                    <div className="text-center">
                      <p className="font-bold text-lg text-white">{bus.to}</p>
                      <p className="text-sm text-slate-300">{bus.arrivalTime}</p>
                      <p className="text-xs text-slate-500">Arrival</p>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-400">
                        ₹{bus.price?.toLocaleString()}
                      </p>
                      <p className="text-sm text-yellow-400 font-semibold mt-1">⭐ {bus.rating}</p>
                      <p className="text-xs text-slate-500 mt-1">{seatsLeft} seats left</p>
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
                            className="w-full border border-white/20 bg-slate-900/50 text-white px-3 py-2 rounded focus:outline-none focus:border-orange-500 text-sm"
                          />
                          <p className="text-sm text-slate-300 text-center font-medium">
                            Total: ₹{bus.price * selectedSeats}
                          </p>
                          <button
                            onClick={() => handleBook(bus)}
                            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white py-2 rounded text-sm font-bold transition-all"
                          >
                            Proceed to Payment
                          </button>
                          <button
                            onClick={() => setSelectedBus(null)}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedBus(bus._id)}
                          className="w-full bg-white/10 hover:bg-orange-500 text-white border border-white/20 hover:border-transparent py-3 rounded-xl font-bold transition-all"
                        >
                          Book Now →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  {bus.amenities && bus.amenities.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                      {bus.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 text-slate-300 text-xs px-2 py-1 rounded-full">
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