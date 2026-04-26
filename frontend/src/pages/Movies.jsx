import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';
import { AuthContext } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const Movies = ({ category = 'movie', searchTerm = '' }) => {
  const { auth } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => 
      movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.language?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  useEffect(() => {
    fetchMovies();
  }, [category]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllMovies(category);
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">{category === 'movie' ? '🎬' : '🎭'}</div>
          <p className="text-gray-600">Loading {category === 'movie' ? 'movies' : 'live shows'}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Movies List */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="mb-6 flex justify-between items-center text-slate-700">
          <h2 className="text-2xl font-bold">{category === 'movie' ? 'Available Movies' : 'Live Performances'}</h2>
          <p>{filteredMovies.length} results found</p>
        </div>
        {filteredMovies.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
            No movies match your search.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovies.map((movie) => {
              const seatsLeft = movie.availableSeats;

              return (
                <div key={movie._id} className="bg-white rounded-2xl p-6 border hover:shadow-xl transition">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                          {movie.category === 'live_show' ? '🎭' : '🍿'}
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