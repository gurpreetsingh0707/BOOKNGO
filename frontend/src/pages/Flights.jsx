import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import PaymentModal from '../components/PaymentModal';
import bookingService from '../services/bookingService';

const Flights = ({ searchTerm }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(null);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [paymentBooking, setPaymentBooking] = useState(null);

  const filteredFlights = useMemo(() => {
    if (!searchTerm) return flights;
    const lowerSearch = searchTerm.toLowerCase();
    return flights.filter(f => 
      f.from?.toLowerCase().includes(lowerSearch) ||
      f.to?.toLowerCase().includes(lowerSearch) ||
      f.name?.toLowerCase().includes(lowerSearch) ||
      f.airline?.toLowerCase().includes(lowerSearch)
    );
  }, [flights, searchTerm]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllFlights();
      setFlights(response.data.flights || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Proper booking flow (pending → payment)
  const handleBooking = async (flight) => {
    try {
      setBookingLoading(flight._id);

      const bookingData = {
        flightId: flight._id,
        seats: selectedSeats,
        travelDate: new Date()
      };

      const response = await bookingService.bookFlight(bookingData);
      const booking = response.data.booking;

      setPaymentBooking({
        _id: booking._id,
        bookingType: 'flight',
        quantity: selectedSeats,
        totalPrice: response.data.totalPrice
      });

      setSelectedFlight(null);
    } catch (error) {
      toast.error(`❌ ${error.response?.data?.message || error.message}`);
    } finally {
      setBookingLoading(null);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('✅ Flight booking confirmed!');
    fetchFlights();
    setPaymentBooking(null);
  };

  const getClassLabel = (classType) => {
    const labels = {
      economy: 'Economy',
      premium_economy: 'Premium Economy',
      business: 'Business',
      first: 'First Class'
    };
    return labels[classType] || classType;
  };

  const getClassColor = (classType) => {
    const colors = {
      economy: 'bg-sky-100 text-sky-700',
      premium_economy: 'bg-violet-100 text-violet-700',
      business: 'bg-amber-100 text-amber-700',
      first: 'bg-rose-100 text-rose-700'
    };
    return colors[classType] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">✈️</div>
          <p className="text-slate-400">Searching flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Flights List */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="mb-6 flex justify-between items-center text-slate-300">
          <h2 className="text-2xl font-bold text-white">Available Flights</h2>
          <p>{filteredFlights.length} results found</p>
        </div>

        {filteredFlights.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-slate-800/30 rounded-2xl border border-white/5 backdrop-blur-sm">
            {searchTerm ? `No flights found matching "${searchTerm}"` : 'No flights available'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map((flight) => {
              const seatsLeft = flight.availableSeats - flight.bookedSeats;

              return (
                <div key={flight._id} className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] transition-all duration-300 hover:-translate-y-1">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">

                    {/* Info */}
                    <div>
                      <h3 className="text-xl font-bold text-white">{flight.name}</h3>
                      <p className="text-sm text-slate-400">
                        {flight.airline} • {flight.flightNumber}
                      </p>
                      <span className={`px-2 py-1 rounded text-xs mt-2 inline-block font-medium ${getClassColor(flight.classType)}`}>
                        {getClassLabel(flight.classType)}
                      </span>
                    </div>

                    {/* From */}
                    <div className="text-center">
                      <p className="font-bold text-lg text-white">{flight.from}</p>
                      <p className="text-sm text-slate-400">{flight.departureTime}</p>
                    </div>

                    {/* Duration */}
                    <div className="text-center">
                      <p className="text-slate-300">{flight.duration}</p>
                      <div className="flex items-center justify-center my-1">
                        <div className="h-[2px] bg-slate-700 w-8"></div>
                        <span className="mx-2 text-sm">✈️</span>
                        <div className="h-[2px] bg-slate-700 w-8"></div>
                      </div>
                      <p className="text-xs text-sky-400">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stops`}
                      </p>
                    </div>

                    {/* To */}
                    <div className="text-center">
                      <p className="font-bold text-lg text-white">{flight.to}</p>
                      <p className="text-sm text-slate-400">{flight.arrivalTime}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-sky-400">
                        ₹{flight.price?.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">{seatsLeft} seats left</p>
                    </div>

                    {/* Booking Section */}
                    <div>
                      {selectedFlight === flight._id ? (
                        <div className="space-y-2">

                          <input
                            type="number"
                            min="1"
                            max={seatsLeft}
                            value={selectedSeats}
                            onChange={(e) => setSelectedSeats(parseInt(e.target.value))}
                            className="w-full border border-white/20 bg-slate-900/50 text-white px-3 py-2 rounded focus:outline-none focus:border-sky-500"
                          />

                          <p className="text-sm text-slate-300 font-medium text-center">
                            Total: ₹{flight.price * selectedSeats}
                          </p>

                          <button
                            onClick={() => handleBooking(flight)}
                            disabled={bookingLoading === flight._id}
                            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold py-2 rounded transition-all"
                          >
                            {bookingLoading === flight._id ? '⏳ Processing...' : 'Pay Now'}
                          </button>

                          <button
                            onClick={() => setSelectedFlight(null)}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedFlight(flight._id)}
                          className="w-full bg-white/10 hover:bg-sky-500 text-white border border-white/20 hover:border-transparent py-3 rounded-xl font-bold transition-all"
                        >
                          Book Now →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ Payment Modal */}
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

export default Flights;