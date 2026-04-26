const axios = require('axios');
const Movie = require('../models/Movie');

// OMDB API se movies fetch kar
const fetchMoviesFromOMDB = async (searchQuery = 'action') => {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?s=${searchQuery}&type=movie&apikey=${process.env.OMDB_API_KEY}`
    );

    if (!response.data.Search) {
      return [];
    }

    const movies = response.data.Search.map(movie => ({
      title: movie.Title,
      genre: ['Action', 'Drama'],
      language: 'English',
      duration: '2h 30m',
      price: Math.floor(Math.random() * (300 - 150 + 1)) + 150,
      availableSeats: 100,
      bookedSeats: 0,
      image: movie.Poster,
      director: 'TBD',
      cast: ['Actor 1', 'Actor 2'],
      description: `Movie: ${movie.Title} (${movie.Year})`,
      releaseDate: new Date(`${movie.Year}-01-01`),
      rating: Math.random() * (5 - 3) + 3,
      isActive: true
    }));

    return movies;
  } catch (error) {
    console.error('Error fetching from OMDB:', error.message);
    return [];
  }
};

// Database mein save kar
const syncMoviesToDB = async () => {
  try {
    const movies = await fetchMoviesFromOMDB('bollywood');
    
    // Duplicates na banenge
    for (const movie of movies) {
      await Movie.findOneAndUpdate(
        { title: movie.title },
        movie,
        { upsert: true, new: true }
      );
    }

    console.log(`✅ ${movies.length} movies synced`);
    return { success: true, count: movies.length };
  } catch (error) {
    console.error('Error syncing movies:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  fetchMoviesFromOMDB,
  syncMoviesToDB
};