const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true // Don't throw on any status
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}→ ${msg}${colors.reset}`),
  test: (msg) => console.log(`\n${colors.yellow}TEST: ${msg}${colors.reset}`)
};

async function testAPI() {
  try {
    // Test 1: Register User
    log.test('Register User');
    const registerRes = await api.post('/auth/register', {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@test.com`,
      phone: '9876543210',
      password: 'password123',
      confirmPassword: 'password123'
    });
    console.log('Status:', registerRes.status);
    if (registerRes.status === 201) {
      log.success('Registration successful');
      authToken = registerRes.data.token;
    } else {
      log.error(`Registration failed: ${registerRes.data.message}`);
    }

    // Test 2: Get All Movies (Public endpoint)
    log.test('Get All Movies');
    const moviesRes = await api.get('/bookings/movie');
    console.log('Status:', moviesRes.status);
    if (moviesRes.status === 200) {
      log.success(`Retrieved ${moviesRes.data.length || 0} movies`);
      console.log('Sample:', moviesRes.data.length > 0 ? moviesRes.data[0] : 'No movies');
    } else {
      log.error(`Failed to get movies: ${moviesRes.data.message}`);
    }

    // Test 3: Search Movies
    log.test('Search Movies');
    const searchRes = await api.get('/bookings/movie/search?q=action');
    console.log('Status:', searchRes.status);
    if (searchRes.status === 200) {
      log.success(`Search found ${searchRes.data.length || 0} results`);
    } else {
      log.error(`Search failed: ${searchRes.data.message}`);
    }

    // Test 4: Login (if registration was successful)
    if (authToken) {
      log.test('Login User');
      const loginRes = await api.post('/auth/login', {
        email: registerRes.data.user.email,
        password: 'password123'
      });
      console.log('Status:', loginRes.status);
      if (loginRes.status === 200) {
        log.success('Login successful');
        authToken = loginRes.data.token;
      } else {
        log.error(`Login failed: ${loginRes.data.message}`);
      }
    }

    // Test 5: Get Trains
    log.test('Get All Trains');
    const trainsRes = await api.get('/bookings/train');
    console.log('Status:', trainsRes.status);
    if (trainsRes.status === 200) {
      log.success(`Retrieved ${trainsRes.data.length || 0} trains`);
    } else {
      log.error(`Failed to get trains: ${trainsRes.data.message}`);
    }

    // Test 6: Get Buses
    log.test('Get All Buses');
    const busesRes = await api.get('/bookings/bus');
    console.log('Status:', busesRes.status);
    if (busesRes.status === 200) {
      log.success(`Retrieved ${busesRes.data.length || 0} buses`);
    } else {
      log.error(`Failed to get buses: ${busesRes.data.message}`);
    }

    // Test 7: Get Hotels
    log.test('Get All Hotels');
    const hotelsRes = await api.get('/bookings/hotel');
    console.log('Status:', hotelsRes.status);
    if (hotelsRes.status === 200) {
      log.success(`Retrieved ${hotelsRes.data.length || 0} hotels`);
    } else {
      log.error(`Failed to get hotels: ${hotelsRes.data.message}`);
    }

    log.test('API Testing Complete!');
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    console.error(error);
  }
}

// Run tests
testAPI();
