const Movie = require('../models/Movie');

// GET all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true });
    res.status(200).json({
      success: true,
      message: 'Movies fetched successfully',
      data: movies,
      count: movies.length
    });
  } catch (error) {
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
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE new movie (Admin only)
exports.createMovie = async (req, res) => {
  try {
    const { title, description, genre, language, duration, releaseDate, price, director, cast, image } = req.body;

    // Validation
    if (!title || !language || !price) {
      return res.status(400).json({
        success: false,
        message: 'Title, language, and price are required'
      });
    }

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(409).json({
        success: false,
        message: 'Movie with this title already exists'
      });
    }

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
      isActive: true
    });

    const savedMovie = await newMovie.save();

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: savedMovie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE movie
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle arrays
    if (updateData.genre && !Array.isArray(updateData.genre)) {
      updateData.genre = [updateData.genre];
    }
    if (updateData.cast && !Array.isArray(updateData.cast)) {
      updateData.cast = [updateData.cast];
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: updatedMovie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE movie (Soft delete - mark as inactive)
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
      data: deletedMovie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get movies by genre
exports.getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    
    const movies = await Movie.find({
      genre: genre,
      isActive: true
    });

    if (!movies || movies.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No movies found for genre: ${genre}`
      });
    }

    res.status(200).json({
      success: true,
      data: movies,
      count: movies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search movies
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { director: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: movies,
      count: movies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update booked seats
exports.updateBookedSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatsToBook } = req.body;

    if (!seatsToBook || seatsToBook <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid number of seats is required'
      });
    }

    const movie = await Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const availableSeats = movie.availableSeats - movie.bookedSeats;
    
    if (seatsToBook > availableSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableSeats} seats available`
      });
    }

    movie.bookedSeats += seatsToBook;
    const updatedMovie = await movie.save();

    res.status(200).json({
      success: true,
      message: 'Seats booked successfully',
      data: updatedMovie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};