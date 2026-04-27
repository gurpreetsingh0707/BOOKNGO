const Movie = require('../models/Movie');

// GET all movies
exports.getAllMovies = async (req, res) => {
  try {
    let filter = { isActive: true };
    
    if (req.query.category) {
      if (req.query.category === 'movie') {
        // Inclusion logic for legacy data: 
        // Show movies that are explicitly 'movie' OR have no category field at all
        filter = {
          isActive: true,
          $or: [
            { category: 'movie' },
            { category: { $exists: false } },
            { category: null },
            { category: '' }
          ]
        };
      } else {
        filter.category = req.query.category;
      }
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Items fetched successfully',
      data: movies,
      count: movies.length
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new movie (Admin only)
exports.createMovie = async (req, res) => {
  try {
    const { title, description, genre, language, duration, releaseDate, price, director, cast, image, category } = req.body;
    if (!title || !language || !price) return res.status(400).json({ success: false, message: 'Title, language, and price are required' });

    const newMovie = new Movie({
      title,
      description,
      genre: Array.isArray(genre) ? genre : [genre],
      language,
      duration,
      releaseDate,
      price,
      director,
      cast: Array.isArray(cast) ? cast : [cast],
      image,
      isActive: true,
      category: category || 'movie'
    });

    const savedMovie = await newMovie.save();
    res.status(201).json({ success: true, message: 'Movie created successfully', data: savedMovie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE movie
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedMovie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.status(200).json({ success: true, message: 'Movie updated successfully', data: updatedMovie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE movie (Soft delete)
exports.deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!deletedMovie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.status(200).json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get movies by genre
exports.getMoviesByGenre = async (req, res) => {
  try {
    const movies = await Movie.find({ genre: req.params.genre, isActive: true });
    res.status(200).json({ success: true, data: movies, count: movies.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search movies
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    });
    res.status(200).json({ success: true, data: movies, count: movies.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booked seats
exports.updateBookedSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatsToBook } = req.body;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    
    movie.bookedSeats += seatsToBook;
    await movie.save();
    res.status(200).json({ success: true, message: 'Seats updated', data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};