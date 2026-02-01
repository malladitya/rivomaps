const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/test',
  method: 'GET'
}, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
  process.exit(1);
});

req.end();
