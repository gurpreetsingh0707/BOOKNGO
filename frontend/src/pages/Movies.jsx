import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { toast } from 'react-toastify';
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
    if (!movies) return [];
    const term = (searchTerm || '').toLowerCase();
    return movies.filter(movie => {
      const title = (movie.title || '').toLowerCase();
      const language = (movie.language || '').toLowerCase();
      return title.includes(term) || language.includes(term);
    });
  }, [movies, searchTerm]);

  useEffect(() => {
    fetchMovies();
  }, [category]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching from database for:', category);
      
      const response = await bookingService.getAllMovies(category);
      
      // Extract data from response.data (Axios structure)
      const data = response.data.data || response.data.movies || response.data || [];
      
      console.log('📦 Data received:', data);
      setMovies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Database Fetch Error:', error.message);
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
        userEmail: auth?.user?.email
      });
      setSelectedMovie(null);
    } catch (error) {
      toast.error(`❌ Booking Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Fetching database data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">
          {category === 'movie' ? '🎬 Available Movies' : '🎭 Live Performances'}
        </h2>
        <div className="bg-slate-100 px-4 py-2 rounded-2xl text-sm font-bold text-slate-600">
          {filteredMovies.length} found
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <div className="text-6xl mb-6">🏜️</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No shows found</h3>
          <p className="text-slate-500 mb-8">We couldn't load any data for the "{category}" category.</p>
          <button 
            onClick={fetchMovies}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition"
          >
            Retry Database Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredMovies.map((movie) => {
            const seatsLeft = (movie.availableSeats || 100) - (movie.bookedSeats || 0);

            return (
            <div key={movie._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6 flex-1">
                  <div className="text-5xl bg-slate-50 w-24 h-24 flex items-center justify-center rounded-3xl border border-slate-100 group-hover:scale-105 transition-transform">
                    {movie.category === 'live_show' ? '🎭' : '🍿'}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 mb-1">{movie.title || 'Untitled'}</h3>
                    <div className="flex gap-2">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{movie.language || 'English'}</span>
                      <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">⭐ {movie.rating || '8.5'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                  <div className="text-center md:text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Per Ticket</p>
                    <p className="text-4xl font-black text-slate-900">₹{movie.price || 0}</p>
                    <p className="text-xs text-green-500 font-bold mt-1 uppercase tracking-tighter">{seatsLeft} seats remaining</p>
                  </div>
                  
                  {selectedMovie === movie._id ? (
                    <div className="space-y-2 w-full min-w-[180px] mt-2">
                      <input
                        type="number"
                        min="1"
                        max={seatsLeft}
                        value={selectedSeats}
                        onChange={(e) => setSelectedSeats(parseInt(e.target.value) || 1)}
                        className="w-full border border-slate-200 bg-slate-50 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="Seats"
                      />
                      <p className="text-sm text-slate-600 text-center font-semibold">
                        Total: ₹{(movie.price || 0) * selectedSeats}
                      </p>
                      <button 
                        onClick={() => handleBook(movie)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        💳 Pay Now
                      </button>
                      <button 
                        onClick={() => { setSelectedMovie(null); setSelectedSeats(1); }}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 rounded-xl transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedMovie(movie._id)}
                      className="mt-4 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95"
                    >
                      BOOK NOW
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onSuccess={() => {
            toast.success('✅ Booking Successful!');
            fetchMovies();
            setPaymentBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default Movies;