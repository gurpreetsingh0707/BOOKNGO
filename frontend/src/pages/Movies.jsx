import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';
import { AuthContext } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const Movies = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllMovies();
      setMovies(response.data.data || response.data.movies || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (movie) => {
    try {
      const bookingData = {
        movieId: movie._id,
        seats: selectedSeats,
        travelDate: new Date()
      };

      const response = await bookingService.bookMovie(bookingData);
      const booking = response.data.booking;

      setPaymentBooking({
        _id: booking._id,
        bookingType: 'movie',
        quantity: selectedSeats,
        totalPrice: response.data.totalPrice,
        userEmail: auth.user?.email
      });

      setSelectedMovie(null);
    } catch (error) {
      console.error('Booking error:', error);
      alert(`❌ ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePaymentSuccess = () => {
    alert('✅ Booking confirmed! Check your booking history.');
    fetchMovies();
    setPaymentBooking(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-5xl mb-4">🎬</div>
            <p className="text-gray-600">Loading movies...</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="absolute left-6 top-6 bg-white text-gray-800 px-4 py-2 rounded-lg border border-white/30 hover:bg-white/90 transition"
          >
            ← Back
          </button>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-center">
            🎬 Book Movie Tickets
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl text-center mx-auto">
            {movies.length} movies showing now. Grab your popcorn!
          </p>
        </div>
      </div>

      {/* Movies List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {movies.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No movies available</div>
        ) : (
          <div className="space-y-4">
            {movies.map((movie) => {
              const seatsLeft = movie.availableSeats;

              return (
                <div key={movie._id} className="bg-white rounded-2xl p-6 border hover:shadow-xl transition">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                          🍿
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{movie.title}</h3>
                          <p className="text-sm text-gray-500">{movie.language}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-center md:text-left">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-800">{movie.duration}</p>
                    </div>

                    {/* Price & Rating */}
                    <div className="text-center md:text-right">
                      <p className="text-2xl font-bold text-red-600">
                        ₹{movie.price?.toLocaleString()}
                      </p>
                      <p className="text-sm text-yellow-500 font-semibold mt-1">⭐ {movie.rating}</p>
                      <p className="text-xs text-gray-400 mt-1">{seatsLeft} seats left</p>
                    </div>

                    {/* Booking Section */}
                    <div>
                      {selectedMovie === movie._id ? (
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
                            Total: ₹{movie.price * selectedSeats}
                          </p>
                          <button
                            onClick={() => handleBook(movie)}
                            className="w-full bg-green-600 text-white py-2 rounded text-sm font-semibold"
                          >
                            Proceed to Payment
                          </button>
                          <button
                            onClick={() => setSelectedMovie(null)}
                            className="w-full bg-gray-300 py-2 rounded text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedMovie(movie._id)}
                          className="w-full bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-transform hover:scale-105"
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

export default Movies;