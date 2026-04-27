import React, { useState, useEffect, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import PaymentModal from '../components/PaymentModal';
import { AuthContext } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const Trains = ({ searchTerm }) => {
  const { auth } = useContext(AuthContext);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);

  const filteredTrains = useMemo(() => {
    if (!searchTerm) return trains;
    const lowerSearch = searchTerm.toLowerCase();
    return trains.filter(t => 
      t.source?.toLowerCase().includes(lowerSearch) ||
      t.destination?.toLowerCase().includes(lowerSearch) ||
      t.trainName?.toLowerCase().includes(lowerSearch) ||
      t.trainNumber?.toString().includes(lowerSearch)
    );
  }, [trains, searchTerm]);

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllTrains();
      setTrains(response.data.trains || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load trains');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (train) => {
    try {
      const bookingData = {
        trainId: train._id,
        seats: selectedSeats,
        travelDate: new Date()
      };

      const response = await bookingService.bookTrain(bookingData);
      const booking = response.data.booking;

      setPaymentBooking({
        _id: booking._id,
        bookingType: 'train',
        quantity: selectedSeats,
        totalPrice: response.data.totalPrice,
        userEmail: auth.user?.email
      });

      setSelectedTrain(null);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(`❌ ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('✅ Booking confirmed! Check your booking history.');
    fetchTrains();
    setPaymentBooking(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-slate-400 text-xl">⏳ Searching trains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Trains List */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="mb-6 flex justify-between items-center text-slate-300">
          <h2 className="text-2xl font-bold text-white">Available Trains</h2>
          <p>{filteredTrains.length} results found</p>
        </div>

        {filteredTrains.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-slate-800/30 rounded-2xl border border-white/5 backdrop-blur-sm">
            <p className="text-lg">{searchTerm ? `No trains found matching "${searchTerm}"` : 'No trains available'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrains.map((train) => (
              <div
                key={train._id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-600 transition-all hover:shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Train Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-white">{train.trainName}</h3>
                    <p className="text-sm text-slate-400">#{train.trainNumber}</p>
                    <span className="inline-block mt-2 px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize font-medium">
                      {train.seatClass}
                    </span>
                  </div>

                  {/* From City & Time */}
                  <div className="md:col-span-2 text-center md:text-left">
                    <p className="text-sm text-slate-400">From</p>
                    <p className="text-xl font-bold text-white">{train.source}</p>
                    <p className="text-sm text-slate-300">{train.departureTime}</p>
                    <p className="text-xs text-slate-500">Departure</p>
                  </div>

                  {/* Duration */}
                  <div className="md:col-span-2 text-center">
                    <p className="text-sm text-slate-400 mb-2">{train.duration}</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-px bg-slate-600 flex-1"></div>
                      <span className="text-2xl">🚂</span>
                      <div className="h-px bg-slate-600 flex-1"></div>
                    </div>
                  </div>

                  {/* To City & Time */}
                  <div className="md:col-span-2 text-center md:text-left">
                    <p className="text-sm text-slate-400">To</p>
                    <p className="text-xl font-bold text-white">{train.destination}</p>
                    <p className="text-sm text-slate-300">{train.arrivalTime}</p>
                    <p className="text-xs text-slate-500">Arrival</p>
                  </div>

                  {/* Price & Rating */}
                  <div className="md:col-span-2 text-center">
                    <p className="text-2xl font-bold text-green-400">₹{train.pricePerSeat}</p>
                    <p className="text-sm text-yellow-400 font-semibold mt-1">⭐ {train.rating}</p>
                    <p className="text-xs text-slate-500 mt-1">{train.availableSeats} seats left</p>
                  </div>

                  {/* Book Button */}
                  <div className="md:col-span-2">
                    {selectedTrain === train._id ? (
                      <div className="space-y-2">
                        <input
                          type="number"
                          min="1"
                          max={train.availableSeats}
                          value={selectedSeats}
                          onChange={(e) => setSelectedSeats(parseInt(e.target.value))}
                          className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                        />
                        <p className="text-sm text-slate-300 text-center font-semibold">
                          Total: ₹{(train.pricePerSeat * selectedSeats).toLocaleString()}
                        </p>
                        <button
                          onClick={() => handleBook(train)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors text-sm"
                        >
                          💳 Pay Now
                        </button>
                        <button
                          onClick={() => setSelectedTrain(null)}
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTrain(train._id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                      >
                        Book Now →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

export default Trains;