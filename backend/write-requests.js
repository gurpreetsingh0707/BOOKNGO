const fs = require('fs');
const path = require('path');

const base = process.cwd();

function write(filePath, content) {
  const fullPath = path.join(base, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Written: ' + filePath);
}

write(
  'postman/collections/New Collection/Auth/Login user.request.yaml',
  [
    '$kind: http-request',
    'name: Login user',
    "url: '{{baseUrl}}/api/auth/login'",
    'method: POST',
    'headers:',
    '  - key: Content-Type',
    '    value: application/json',
    'body:',
    '  type: json',
    '  content: |-',
    '    {',
    '      "email": "testuser@example.com",',
    '      "password": "Test@1234"',
    '    }',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      // Auto-capture JWT token after login',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 200", function () {',
    '          pm.response.to.have.status(200);',
    '      });',
    '      pm.test("Response has token", function () {',
    '          pm.expect(res).to.have.property("token");',
    '      });',
    '      if (res.token) {',
    "          pm.environment.set(\"token\", res.token);",
    "          console.log(\"Token saved to environment variable 'token'\");",
    '      }',
    '      pm.test("Response has user object", function () {',
    '          pm.expect(res).to.have.property("user");',
    '      });',
    'order: 2000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Auth/Register user.request.yaml',
  [
    '$kind: http-request',
    'name: Register user',
    "url: '{{baseUrl}}/api/auth/register'",
    'method: POST',
    'headers:',
    '  - key: Content-Type',
    '    value: application/json',
    'body:',
    '  type: json',
    '  content: |-',
    '    {',
    '        "firstName": "John",',
    '        "lastName": "Doe",',
    '        "email": "john@example.com",',
    '        "phone": "9876543210",',
    '        "password": "password123",',
    '        "confirmPassword": "password123"',
    '    }',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 201", function () {',
    '          pm.response.to.have.status(201);',
    '      });',
    '      pm.test("Response has token", function () {',
    '          pm.expect(res).to.have.property("token");',
    '      });',
    '      if (res.token) {',
    '          pm.environment.set("token", res.token);',
    "          console.log(\"Token saved to environment variable 'token'\");",
    '      }',
    'order: 1000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Movies/Get All Movies.request.yaml',
  [
    '$kind: http-request',
    'name: Get All Movies',
    "url: '{{baseUrl}}/api/movies'",
    'method: GET',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 200", function () {',
    '          pm.response.to.have.status(200);',
    '      });',
    '      pm.test("Response is an array", function () {',
    '          pm.expect(res).to.be.an("array");',
    '      });',
    '      pm.test("Movies have required fields", function () {',
    '          if (res.length > 0) {',
    '              pm.expect(res[0]).to.have.property("_id");',
    '              pm.expect(res[0]).to.have.property("title");',
    '          }',
    '      });',
    '      if (res.length > 0) {',
    '          pm.environment.set("movieId", res[0]._id);',
    '          console.log("movieId saved: " + res[0]._id);',
    '      }',
    'order: 1000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Trains/Get All Trains.request.yaml',
  [
    '$kind: http-request',
    'name: Get All Trains',
    "url: '{{baseUrl}}/api/trains'",
    'method: GET',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 200", function () {',
    '          pm.response.to.have.status(200);',
    '      });',
    '      pm.test("Response is an array", function () {',
    '          pm.expect(res).to.be.an("array");',
    '      });',
    '      pm.test("Trains have required fields", function () {',
    '          if (res.length > 0) {',
    '              pm.expect(res[0]).to.have.property("_id");',
    '              pm.expect(res[0]).to.have.property("name");',
    '          }',
    '      });',
    '      if (res.length > 0) {',
    '          pm.environment.set("trainId", res[0]._id);',
    '          console.log("trainId saved: " + res[0]._id);',
    '      }',
    'order: 1000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Hotels/Get All Hotels.request.yaml',
  [
    '$kind: http-request',
    'name: Get All Hotels',
    "url: '{{baseUrl}}/api/hotels'",
    'method: GET',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 200", function () {',
    '          pm.response.to.have.status(200);',
    '      });',
    '      pm.test("Response is an array", function () {',
    '          pm.expect(res).to.be.an("array");',
    '      });',
    '      pm.test("Hotels have required fields", function () {',
    '          if (res.length > 0) {',
    '              pm.expect(res[0]).to.have.property("_id");',
    '              pm.expect(res[0]).to.have.property("name");',
    '          }',
    '      });',
    '      if (res.length > 0) {',
    '          pm.environment.set("hotelId", res[0]._id);',
    '          console.log("hotelId saved: " + res[0]._id);',
    '      }',
    'order: 1000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Buses/Get All Buses.request.yaml',
  [
    '$kind: http-request',
    'name: Get All Buses',
    "url: '{{baseUrl}}/api/buses'",
    'method: GET',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 200", function () {',
    '          pm.response.to.have.status(200);',
    '      });',
    '      pm.test("Response is an array", function () {',
    '          pm.expect(res).to.be.an("array");',
    '      });',
    '      pm.test("Buses have required fields", function () {',
    '          if (res.length > 0) {',
    '              pm.expect(res[0]).to.have.property("_id");',
    '              pm.expect(res[0]).to.have.property("name");',
    '          }',
    '      });',
    '      if (res.length > 0) {',
    '          pm.environment.set("busId", res[0]._id);',
    '          console.log("busId saved: " + res[0]._id);',
    '      }',
    'order: 1000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Bookings/Create Booking.request.yaml',
  [
    '$kind: http-request',
    'name: Create Booking',
    "url: '{{baseUrl}}/api/bookings'",
    'method: POST',
    'auth:',
    '  type: bearer',
    '  credentials:',
    '    - key: token',
    "      value: '{{token}}'",
    'headers:',
    '  - key: Content-Type',
    '    value: application/json',
    'body:',
    '  type: json',
    '  content: |-',
    '    {',
    '      "serviceType": "movie",',
    '      "serviceId": "{{movieId}}",',
    '      "seats": 2,',
    '      "totalAmount": 400',
    '    }',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 201", function () {',
    '          pm.response.to.have.status(201);',
    '      });',
    '      pm.test("Booking created with ID", function () {',
    '          pm.expect(res).to.have.property("_id");',
    '      });',
    '      pm.test("Booking has correct serviceType", function () {',
    '          pm.expect(res.serviceType).to.eql("movie");',
    '      });',
    '      if (res._id) {',
    '          pm.environment.set("bookingId", res._id);',
    '          console.log("bookingId saved: " + res._id);',
    '      }',
    'order: 1000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Bookings/Get My Bookings.request.yaml',
  [
    '$kind: http-request',
    'name: Get My Bookings',
    "url: '{{baseUrl}}/api/bookings/my'",
    'method: GET',
    'auth:',
    '  type: bearer',
    '  credentials:',
    '    - key: token',
    "      value: '{{token}}'",
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 200", function () {',
    '          pm.response.to.have.status(200);',
    '      });',
    '      pm.test("Response is an array", function () {',
    '          pm.expect(res).to.be.an("array");',
    '      });',
    'order: 2000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Search/Search by Service Type.request.yaml',
  [
    '$kind: http-request',
    'name: Search by Service Type',
    "url: '{{baseUrl}}/api/search?type=movie&q=avengers'",
    'method: GET',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 200", function () {',
    '          pm.response.to.have.status(200);',
    '      });',
    '      pm.test("Response has results", function () {',
    '          pm.expect(res).to.be.an("array").or.to.have.property("results");',
    '      });',
    'order: 1000',
    ''
  ].join('\n')
);

write(
  'postman/collections/New Collection/Service Types/Get Service Types.request.yaml',
  [
    '$kind: http-request',
    'name: Get Service Types',
    "url: '{{baseUrl}}/api/service-types'",
    'method: GET',
    'scripts:',
    '  - type: afterResponse',
    '    language: text/javascript',
    '    code: |-',
    '      const res = pm.response.json();',
    '      pm.test("Status code is 200", function () {',
    '          pm.response.to.have.status(200);',
    '      });',
    '      pm.test("Response is an array", function () {',
    '          pm.expect(res).to.be.an("array");',
    '      });',
    'order: 1000',
    ''
  ].join('\n')
);

console.log('All 10 files written successfully.');
