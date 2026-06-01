const http = require('http');

const data = JSON.stringify({
  name: 'Ramm',
  age: '19',
  goal: 'Build a successful AI startup',
  struggle: 'Lack of consistency',
  oneYearVision: 'Running a profitable AI company',
  tone: 'Brutally Honest'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/generate-futureme',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Sending request to backend...');
const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response body:', body);
  });
});

req.on('error', (error) => {
  console.error('Request failed:', error);
});

req.write(data);
req.end();
