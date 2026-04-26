// backend/seed.js - Fixed field names

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Movie = require('./models/Movie');
const Train = require('./models/Train');
const Bus = require('./models/Bus');
const Hotel = require('./models/Hotel');
const Flight = require('./models/Flight');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-platform')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data and drop indexes
    await Movie.collection.drop().catch(() => {});
    await Train.collection.drop().catch(() => {});
    await Bus.collection.drop().catch(() => {});
    await Hotel.collection.drop().catch(() => {});
    await Flight.collection.drop().catch(() => {});

    // Seed Movies
    const movies = await Movie.insertMany([
      {
        title: 'Avengers: Endgame',
        language: 'English',
        duration: '3h 2m',
        price: 250,
        availableSeats: 100,
        bookedSeats: 0,
        rating: 4.8,
        genre: ['Action', 'Adventure'],
        director: 'Anthony Russo',
        cast: ['Robert Downey Jr', 'Chris Evans'],
        isActive: true
      },
      {
        title: 'Inception',
        language: 'English',
        duration: '2h 28m',
        price: 200,
        availableSeats: 100,
        bookedSeats: 0,
        rating: 4.9,
        genre: ['Sci-Fi', 'Thriller'],
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio'],
        isActive: true
      },
      {
        title: 'The Dark Knight',
        language: 'English',
        duration: '2h 32m',
        price: 220,
        availableSeats: 100,
        bookedSeats: 0,
        rating: 4.9,
        genre: ['Action', 'Crime'],
        director: 'Christopher Nolan',
        cast: ['Christian Bale'],
        isActive: true
      },
      {
        title: 'Interstellar',
        language: 'English',
        duration: '2h 49m',
        price: 300,
        availableSeats: 100,
        bookedSeats: 0,
        rating: 4.7,
        genre: ['Sci-Fi', 'Drama'],
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey'],
        isActive: true
      }
    ]);

    // Seed Trains - FIXED FIELD NAMES
    const trains = await Train.insertMany([
      {
        trainName: 'Rajdhani Express',
        trainNumber: '12951',
        source: 'Delhi',
        destination: 'Mumbai',
        departureTime: '16:45',
        arrivalTime: '09:15',
        duration: '16h 30m',
        totalSeats: 500,
        availableSeats: 500,
        bookedSeats: 0,
        pricePerSeat: 1500,
        seatClass: 'ac3',
        rating: 4.6,
        facilities: ['WiFi', 'Food', 'AC'],
        runDays: ['Mon', 'Wed', 'Fri'],
        isActive: true
      },
      {
        trainName: 'Shatabdi Express',
        trainNumber: '12002',
        source: 'Delhi',
        destination: 'Chandigarh',
        departureTime: '06:10',
        arrivalTime: '10:40',
        duration: '4h 30m',
        totalSeats: 500,
        availableSeats: 500,
        bookedSeats: 0,
        pricePerSeat: 800,
        seatClass: 'ac2',
        rating: 4.7,
        facilities: ['WiFi', 'Food', 'AC'],
        runDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        isActive: true
      },
      {
        trainName: 'Garib Rath',
        trainNumber: '12620',
        source: 'Delhi',
        destination: 'Chennai',
        departureTime: '22:00',
        arrivalTime: '22:00',
        duration: '28h',
        totalSeats: 500,
        availableSeats: 500,
        bookedSeats: 0,
        pricePerSeat: 1200,
        seatClass: 'sleeper',
        rating: 4.5,
        facilities: ['Food', 'Sleeper'],
        runDays: ['Mon', 'Thu'],
        isActive: true
      },
      {
        trainName: 'Premium Express',
        trainNumber: '12707',
        source: 'Mumbai',
        destination: 'Bangalore',
        departureTime: '10:00',
        arrivalTime: '00:00',
        duration: '14h',
        totalSeats: 500,
        availableSeats: 500,
        bookedSeats: 0,
        pricePerSeat: 2000,
        seatClass: 'ac1',
        rating: 4.8,
        facilities: ['WiFi', 'Food', 'AC', 'Shower'],
        runDays: ['Daily'],
        isActive: true
      }
    ]);

    // Seed Buses
    const buses = await Bus.insertMany([
      {
        name: 'Volvo AC',
        busNumber: 'AB123CD',
        from: 'Delhi',
        to: 'Jaipur',
        departureTime: '06:00',
        arrivalTime: '11:00',
        duration: '5h',
        totalSeats: 50,
        availableSeats: 50,
        bookedSeats: 0,
        price: 600,
        busType: 'deluxe',
        rating: 4.5,
        amenities: ['WiFi', 'AC', 'Charging'],
        operator: 'TravelXpress',
        isActive: true
      },
      {
        name: 'State Bus',
        busNumber: 'AB456CD',
        from: 'Delhi',
        to: 'Chandigarh',
        departureTime: '07:30',
        arrivalTime: '13:30',
        duration: '6h',
        totalSeats: 50,
        availableSeats: 50,
        bookedSeats: 0,
        price: 400,
        busType: 'standard',
        rating: 4.3,
        amenities: ['AC'],
        operator: 'State Transport',
        isActive: true
      },
      {
        name: 'Deluxe Coach',
        busNumber: 'AB789CD',
        from: 'Mumbai',
        to: 'Pune',
        departureTime: '08:00',
        arrivalTime: '12:30',
        duration: '4h 30m',
        totalSeats: 50,
        availableSeats: 50,
        bookedSeats: 0,
        price: 700,
        busType: 'deluxe',
        rating: 4.6,
        amenities: ['WiFi', 'AC', 'Food'],
        operator: 'LuxusBus',
        isActive: true
      },
      {
        name: 'Premium Sleeper',
        busNumber: 'AB999CD',
        from: 'Delhi',
        to: 'Goa',
        departureTime: '20:00',
        arrivalTime: '20:00',
        duration: '28h',
        totalSeats: 50,
        availableSeats: 50,
        bookedSeats: 0,
        price: 1500,
        busType: 'sleeper',
        rating: 4.7,
        amenities: ['WiFi', 'AC', 'Sleeper', 'Food'],
        operator: 'GraceJourney',
        isActive: true
      }
    ]);

    // Seed Hotels
    const hotels = await Hotel.insertMany([
      {
        name: 'Taj Palace',
        city: 'Delhi',
        address: '1, Mansingh Road, New Delhi',
        description: 'Luxury 5-star hotel in heart of Delhi',
        rating: 4.9,
        pricePerNight: 5000,
        totalRooms: 50,
        availableRooms: 50,
        bookedRooms: 0,
        roomType: 'suite',
        category: '5-star',
        amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
        facilities: ['Parking', 'AC', 'TV', 'Minibar'],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        phone: '011-2301-6162',
        email: 'reservations@tajpalace.com',
        isActive: true
      },
      {
        name: 'The Oberoi',
        city: 'Mumbai',
        address: 'Nariman Point, Mumbai',
        description: 'Premium 5-star hotel with sea view',
        rating: 4.8,
        pricePerNight: 6000,
        totalRooms: 50,
        availableRooms: 50,
        bookedRooms: 0,
        roomType: 'double',
        category: '5-star',
        amenities: ['WiFi', 'Pool', 'Gym', 'SPA'],
        facilities: ['Parking', 'AC', 'TV', 'Minibar'],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        phone: '022-6632-5757',
        email: 'reservations@oberoi.com',
        isActive: true
      },
      {
        name: 'ITC Hotels',
        city: 'Bangalore',
        address: 'Bangalore IT Park',
        description: '4-star hotel near IT corridor',
        rating: 4.7,
        pricePerNight: 4000,
        totalRooms: 50,
        availableRooms: 50,
        bookedRooms: 0,
        roomType: 'double',
        category: '4-star',
        amenities: ['WiFi', 'Pool', 'Gym'],
        facilities: ['Parking', 'AC', 'TV'],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        phone: '080-6660-9999',
        email: 'reservations@itc.com',
        isActive: true
      },
      {
        name: 'Comfort Inn',
        city: 'Delhi',
        address: 'Paharganj, New Delhi',
        description: 'Budget 3-star hotel near station',
        rating: 4.5,
        pricePerNight: 2000,
        totalRooms: 50,
        availableRooms: 50,
        bookedRooms: 0,
        roomType: 'single',
        category: '3-star',
        amenities: ['WiFi', 'Restaurant'],
        facilities: ['Parking', 'AC', 'TV'],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        phone: '011-4151-4151',
        email: 'reservations@comfortinn.com',
        isActive: true
      }
    ]);

    // Seed Flights
    const flights = await Flight.insertMany([
      {
        flightName: 'IndiGo Express',
        flightNumber: '6E-2001',
        airline: 'IndiGo',
        source: 'Delhi',
        destination: 'Mumbai',
        departureTime: '06:30',
        arrivalTime: '08:45',
        duration: '2h 15m',
        totalSeats: 180,
        availableSeats: 180,
        bookedSeats: 0,
        price: 4500,
        classType: 'economy',
        rating: 4.3,
        amenities: ['Snacks', 'WiFi'],
        stops: 0,
        aircraft: 'Airbus A320',
        isActive: true
      },
      {
        flightName: 'Air India Royal',
        flightNumber: 'AI-101',
        airline: 'Air India',
        source: 'Delhi',
        destination: 'Bangalore',
        departureTime: '10:00',
        arrivalTime: '12:45',
        duration: '2h 45m',
        totalSeats: 180,
        availableSeats: 180,
        bookedSeats: 0,
        price: 6500,
        classType: 'business',
        rating: 4.6,
        amenities: ['Meal', 'WiFi', 'Entertainment', 'Lounge'],
        stops: 0,
        aircraft: 'Boeing 787',
        isActive: true
      },
      {
        flightName: 'SpiceJet Budget',
        flightNumber: 'SG-8821',
        airline: 'SpiceJet',
        source: 'Mumbai',
        destination: 'Goa',
        departureTime: '14:00',
        arrivalTime: '15:15',
        duration: '1h 15m',
        totalSeats: 180,
        availableSeats: 180,
        bookedSeats: 0,
        price: 3200,
        classType: 'economy',
        rating: 4.1,
        amenities: ['Snacks'],
        stops: 0,
        aircraft: 'Boeing 737',
        isActive: true
      },
      {
        flightName: 'Vistara Premium',
        flightNumber: 'UK-945',
        airline: 'Vistara',
        source: 'Bangalore',
        destination: 'Delhi',
        departureTime: '19:30',
        arrivalTime: '22:15',
        duration: '2h 45m',
        totalSeats: 180,
        availableSeats: 180,
        bookedSeats: 0,
        price: 8500,
        classType: 'premium_economy',
        rating: 4.8,
        amenities: ['Meal', 'WiFi', 'Entertainment', 'Priority Boarding'],
        stops: 0,
        aircraft: 'Airbus A321neo',
        isActive: true
      }
    ]);

    console.log('✅ Movies seeded:', movies.length);
    console.log('✅ Trains seeded:', trains.length);
    console.log('✅ Buses seeded:', buses.length);
    console.log('✅ Hotels seeded:', hotels.length);
    console.log('✅ Flights seeded:', flights.length);
    console.log('\n🎉 Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();