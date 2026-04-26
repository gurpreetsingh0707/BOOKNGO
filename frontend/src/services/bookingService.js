import api from './api';

const bookingService = {
  // Movie Bookings
  bookMovie: (movieData) => {
    return api.post('/bookings/movie', movieData);
  },

  getAllMovies: () => {
    return api.get('/movies');
  },

  // Train Bookings
  bookTrain: (trainData) => {
    return api.post('/bookings/train', trainData);
  },

  getAllTrains: (from, to) => {
    let url = '/bookings/trains';
    const params = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    if (params.length > 0) url += '?' + params.join('&');
    return api.get(url);
  },

  // Bus Bookings
  bookBus: (busData) => {
    return api.post('/bookings/bus', busData);
  },

  getAllBuses: (from, to) => {
    let url = '/bookings/buses';
    const params = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    if (params.length > 0) url += '?' + params.join('&');
    return api.get(url);
  },

  // Hotel Bookings
  bookHotel: (hotelData) => {
    return api.post('/bookings/hotel', hotelData);
  },

  getAllHotels: (city) => {
    let url = '/bookings/hotels';
    if (city) url += `?city=${city}`;
    return api.get(url);
  },

  // Flight Bookings
  bookFlight: (flightData) => {
    return api.post('/bookings/flight', flightData);
  },

  getAllFlights: (from, to) => {
    let url = '/bookings/flights';
    const params = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    if (params.length > 0) url += '?' + params.join('&');
    return api.get(url);
  },

  // User Bookings
  getUserBookings: () => {
    return api.get('/bookings/user');
  },

  getBooking: (bookingId) => {
    return api.get(`/bookings/${bookingId}`);
  },

  cancelBooking: (bookingId) => {
    return api.delete(`/bookings/${bookingId}`);
  }
};

export default bookingService;