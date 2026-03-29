import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Movies = () => {
  const navigate = useNavigate();
  const [selectedMovies, setSelectedMovies] = useState([]);

  const movies = [
    { id: 1, title: 'Avengers: Endgame', price: 250, rating: 4.8, image: '🎬', language: 'English', duration: '3h 2m' },
    { id: 2, title: 'Inception', price: 200, rating: 4.9, image: '🎬', language: 'English', duration: '2h 28m' },
    { id: 3, title: 'The Dark Knight', price: 220, rating: 4.9, image: '🎬', language: 'English', duration: '2h 32m' },
    { id: 4, title: 'Interstellar', price: 300, rating: 4.7, image: '🎬', language: 'English', duration: '2h 49m' },
    { id: 5, title: 'The Matrix', price: 180, rating: 4.8, image: '🎬', language: 'English', duration: '2h 16m' },
    { id: 6, title: 'Parasite', price: 220, rating: 4.9, image: '🎬', language: 'Korean', duration: '2h 12m' },
    { id: 7, title: 'Dune', price: 280, rating: 4.6, image: '🎬', language: 'English', duration: '2h 35m' },
    { id: 8, title: 'Oppenheimer', price: 300, rating: 4.8, image: '🎬', language: 'English', duration: '3h 0m' },
  ];

  const toggleSelect = (movieId) => {
    setSelectedMovies(prev =>
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  const handleBooking = () => {
    if (selectedMovies.length === 0) {
      alert('Please select at least one movie!');
      return;
    }
    const total = selectedMovies.reduce((sum, id) => {
      const movie = movies.find(m => m.id === id);
      return sum + (movie?.price || 0);
    }, 0);
    alert(`Booking ${selectedMovies.length} movie(s) for ₹${total}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20"></div>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="absolute left-6 top-6 bg-white text-gray-800 px-4 py-2 rounded-lg border border-white/30 hover:bg-white/90 transition"
          >
            ← Back
          </button>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            🎬 Book Movie Tickets
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl ">
            Choose from the latest blockbusters and classics. Secure your seats now!
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => toggleSelect(movie.id)}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300 ${
                selectedMovies.includes(movie.id) ? 'ring-2 ring-red-500 shadow-2xl' : 'hover:shadow-xl'
              }`}
            >
              {/* Movie Card */}
              <div className="bg-white h-full flex flex-col overflow-hidden">
                {/* Image/Icon */}
                <div className="bg-gradient-to-br from-red-500 to-pink-500 h-40 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {movie.image}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{movie.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{movie.language} • {movie.duration}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-600">₹{movie.price}</span>
                      <span className="text-yellow-500 font-semibold">⭐ {movie.rating}</span>
                    </div>

                    <div className={`w-full py-2 px-3 rounded-lg font-semibold transition-all duration-300 text-center ${
                      selectedMovies.includes(movie.id)
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-600 group-hover:bg-red-100'
                    }`}>
                      {selectedMovies.includes(movie.id) ? '✓ Selected' : 'Select'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Checkout Bar */}
        {selectedMovies.length > 0 && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 px-4 animate-slide-up">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-full shadow-2xl px-8 py-4 flex items-center justify-between max-w-md w-full text-white">
              <div>
                <p className="text-sm font-medium">Selected: {selectedMovies.length} movie(s)</p>
                <p className="text-2xl font-bold">
                  ₹{selectedMovies.reduce((sum, id) => sum + (movies.find(m => m.id === id)?.price || 0), 0)}
                </p>
              </div>
              <button
                onClick={handleBooking}
                className="bg-white text-red-600 font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Book →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;