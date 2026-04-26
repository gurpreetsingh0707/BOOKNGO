const Train = require('../models/Train');
const Hotel = require('../models/Hotel');
const Bus = require('../models/Bus');

// Fake Trains
const trainNames = [
  'Rajdhani Express',
  'Shatabdi Express',
  'Duronto Express',
  'Vande Bharat',
  'Ashram Express'
];

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

const generateFakeTrains = () => {
  const trains = [];
  for (let i = 0; i < 10; i++) {
    const source = cities[Math.floor(Math.random() * cities.length)];
    let destination = cities[Math.floor(Math.random() * cities.length)];
    while (destination === source) {
      destination = cities[Math.floor(Math.random() * cities.length)];
    }

    trains.push({
      trainName: trainNames[Math.floor(Math.random() * trainNames.length)],
      trainNumber: `TR${String(i + 1).padStart(5, '0')}`,
      source,
      destination,
      departureTime: `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`,
      arrivalTime: `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`,
      duration: `${Math.floor(Math.random() * 20) + 2}h ${Math.floor(Math.random() * 60)}m`,
      trainType: ['Express', 'Local', 'Shatabdi', 'Rajdhani'][Math.floor(Math.random() * 4)],
      totalSeats: 500,
      availableSeats: 500,
      bookedSeats: 0,
      pricePerSeat: Math.floor(Math.random() * (1000 - 300 + 1)) + 300,
      isActive: true
    });
  }
  return trains;
};

// Fake Hotels
const hotelNames = ['Taj Hotel', 'Oberoi', 'Marriott', 'ITC', 'Hyatt', 'Radisson'];

const generateFakeHotels = () => {
  const hotels = [];
  for (let i = 0; i < 15; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    hotels.push({
      hotelName: hotelNames[Math.floor(Math.random() * hotelNames.length)] + ` ${city}`,
      location: `Downtown ${city}`,
      city,
      rating: (Math.random() * (5 - 3) + 3).toFixed(1),
      roomTypes: ['Single', 'Double', 'Deluxe'],
      totalRooms: 100,
      availableRooms: 100,
      bookedRooms: 0,
      pricePerNight: Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000,
      amenities: ['WiFi', 'Pool', 'AC', 'Restaurant', 'Parking'],
      description: `Luxury hotel in ${city}`,
      image: 'hotel.jpg',
      contactNumber: '9876543210',
      email: `hotel@example.com`,
      isActive: true
    });
  }
  return hotels;
};

// Fake Buses
const busOperators = ['RedBus', 'GoIbibo', 'MakeMyTrip', 'Ixigo'];

const generateFakeBuses = () => {
  const buses = [];
  for (let i = 0; i < 12; i++) {
    const source = cities[Math.floor(Math.random() * cities.length)];
    let destination = cities[Math.floor(Math.random() * cities.length)];
    while (destination === source) {
      destination = cities[Math.floor(Math.random() * cities.length)];
    }

    buses.push({
      busName: `${busOperators[Math.floor(Math.random() * busOperators.length)]} Bus`,
      busNumber: `BUS${String(i + 1).padStart(5, '0')}`,
      busOperator: busOperators[Math.floor(Math.random() * busOperators.length)],
      source,
      destination,
      departureTime: `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arrivalTime: `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      duration: `${Math.floor(Math.random() * 15) + 2}h ${Math.floor(Math.random() * 60)}m`,
      busType: ['AC', 'Non-AC', 'Sleeper'][Math.floor(Math.random() * 3)],
      totalSeats: 50,
      availableSeats: 50,
      bookedSeats: 0,
      pricePerSeat: Math.floor(Math.random() * (800 - 200 + 1)) + 200,
      amenities: ['WiFi', 'Charging', 'AC'],
      image: 'bus.jpg',
      isActive: true
    });
  }
  return buses;
};

// Sync to database
const syncFakeData = async () => {
  try {
    // Trains
    const trains = generateFakeTrains();
    for (const train of trains) {
      await Train.findOneAndUpdate(
        { trainNumber: train.trainNumber },
        train,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${trains.length} trains synced`);

    // Hotels
    const hotels = generateFakeHotels();
    for (const hotel of hotels) {
      await Hotel.findOneAndUpdate(
        { hotelName: hotel.hotelName },
        hotel,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${hotels.length} hotels synced`);

    // Buses
    const buses = generateFakeBuses();
    for (const bus of buses) {
      await Bus.findOneAndUpdate(
        { busNumber: bus.busNumber },
        bus,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${buses.length} buses synced`);

    return { success: true };
  } catch (error) {
    console.error('Error syncing fake data:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateFakeTrains,
  generateFakeHotels,
  generateFakeBuses,
  syncFakeData
};