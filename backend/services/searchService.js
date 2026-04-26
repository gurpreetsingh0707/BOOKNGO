const axios = require('axios');

// Unified search function
const searchByServiceType = async (serviceType, query) => {
  try {
    let results = [];

    switch (serviceType.toLowerCase()) {
      case 'movie':
        results = await searchOMDB(query);
        break;

      case 'train':
        results = await searchTrains(query);
        break;

      case 'hotel':
        results = await searchHotels(query);
        break;

      case 'bus':
        results = await searchBuses(query);
        break;

      default:
        results = [];
    }

    return {
      success: true,
      serviceType: serviceType,
      data: results,
      count: results.length
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// OMDB Search - REAL API CALL
const searchOMDB = async (query) => {
  try {
    console.log('🔍 Searching OMDB for:', query);
    console.log('🔑 API Key:', process.env.OMDB_API_KEY);

    if (!process.env.OMDB_API_KEY) {
      console.error('❌ OMDB API Key not found in .env');
      return [];
    }

    const response = await axios.get(
      `https://www.omdbapi.com/?s=${query || 'action'}&type=movie&apikey=${process.env.OMDB_API_KEY}`
    );

    console.log('📊 OMDB Response Status:', response.status);
    console.log('📊 OMDB Response Data:', response.data);

    if (!response.data.Search) {
      console.warn('⚠️ No results from OMDB');
      return [];
    }

    const movies = response.data.Search.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      type: movie.Type,
      price: Math.floor(Math.random() * (300 - 150 + 1)) + 150,
      availableSeats: 100,
      rating: Math.random() * (5 - 3) + 3,
      genre: ['Action', 'Drama'],
      duration: '2h 30m'
    }));

    console.log('✅ Movies mapped:', movies.length);
    return movies;
  } catch (error) {
    console.error('❌ OMDB Error:', error.message);
    console.error('Full error:', error.response?.data || error);
    return [];
  }
};

// Trains Search (Fake data)
const searchTrains = async (query) => {
  const trains = [
    {
      id: 'TRAIN001',
      trainName: 'Rajdhani Express',
      source: 'Delhi',
      destination: 'Mumbai',
      departureTime: '10:30 AM',
      arrivalTime: '08:45 PM',
      duration: '22h 15m',
      price: 750,
      availableSeats: 500
    },
    {
      id: 'TRAIN002',
      trainName: 'Shatabdi Express',
      source: 'Delhi',
      destination: 'Agra',
      departureTime: '06:00 AM',
      arrivalTime: '08:30 AM',
      duration: '2h 30m',
      price: 500,
      availableSeats: 400
    }
  ];
  return trains;
};

// Hotels Search (Fake data)
const searchHotels = async (query) => {
  const hotels = [
    {
      id: 'HOTEL001',
      hotelName: 'Taj Hotel',
      location: 'Colaba',
      city: 'Mumbai',
      rating: 4.5,
      price: 5000,
      availableRooms: 100
    },
    {
      id: 'HOTEL002',
      hotelName: 'Oberoi Hotel',
      location: 'Bandra',
      city: 'Mumbai',
      rating: 4.8,
      price: 7000,
      availableRooms: 80
    }
  ];
  return hotels;
};

// Buses Search (Fake data)
const searchBuses = async (query) => {
  const buses = [
    {
      id: 'BUS001',
      busName: 'Volvo Bus',
      source: 'Delhi',
      destination: 'Agra',
      departureTime: '11:00 PM',
      arrivalTime: '05:00 AM',
      duration: '6h',
      price: 300,
      availableSeats: 50
    },
    {
      id: 'BUS002',
      busName: 'AC Bus',
      source: 'Delhi',
      destination: 'Agra',
      departureTime: '10:00 PM',
      arrivalTime: '04:30 AM',
      duration: '6h 30m',
      price: 250,
      availableSeats: 45
    }
  ];
  return buses;
};

module.exports = {
  searchByServiceType
};