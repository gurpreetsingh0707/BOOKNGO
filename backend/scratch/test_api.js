const axios = require('axios');

async function testApi() {
  try {
    console.log('Testing /api/movies...');
    const res = await axios.get('http://localhost:5000/api/movies');
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
    
    console.log('\nTesting /api/movies?category=live_show...');
    const res2 = await axios.get('http://localhost:5000/api/movies?category=live_show');
    console.log('Status:', res2.status);
    console.log('Data:', JSON.stringify(res2.data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) {
      console.error('Response:', err.response.data);
    }
  }
}

testApi();
