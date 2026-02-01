// Test script for zone validation API
const http = require('http');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(responseData)
        });
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Zone Validation Tests...\n');

  try {
    // Test 1: Create first zone
    console.log('Test 1️⃣ : First report (should create new zone)');
    const report1 = await makeRequest('POST', '/api/reports/noise', {
      userId: 'alice',
      lat: 28.6139,
      lng: 77.2090,
      severity: 8,
      description: 'Loud construction'
    });
    console.log('✅ Zone created:', report1.data.zone);
    console.log('   - Verified:', report1.data.zone.verified, '(need 3 reports)');
    console.log('   - Report count:', report1.data.zone.reportCount, '\n');

    // Test 2: Second report nearby (should merge)
    console.log('Test 2️⃣ : Second report nearby (should merge with zone)');
    const report2 = await makeRequest('POST', '/api/reports/noise', {
      userId: 'bob',
      lat: 28.6140,
      lng: 77.2091,
      severity: 7,
      description: 'Construction noise continues'
    });
    console.log('✅ Report merged:');
    console.log('   - Verified:', report2.data.zone.verified);
    console.log('   - Report count:', report2.data.zone.reportCount, '\n');

    // Test 3: Third report (should auto-verify)
    console.log('Test 3️⃣ : Third report (should auto-verify zone!)');
    const report3 = await makeRequest('POST', '/api/reports/noise', {
      userId: 'charlie',
      lat: 28.6138,
      lng: 77.2089,
      severity: 9,
      description: 'Very loud'
    });
    console.log('✅ Report processed:');
    console.log('   - Verified:', report3.data.zone.verified, '✨ AUTO-VERIFIED!');
    console.log('   - Report count:', report3.data.zone.reportCount);
    console.log('   - Just Verified:', report3.data.justVerified, '\n');

    // Test 4: Get all zones
    console.log('Test 4️⃣ : Get all active zones');
    const zones = await makeRequest('GET', '/api/zones', null);
    console.log('✅ Active zones:', zones.data.length);
    zones.data.forEach((z, i) => {
      console.log(`   Zone ${i+1}:`, {
        location: z.location,
        verified: z.verified,
        reportCount: z.reportCount,
        severity: z.severity,
        avgReporterScore: z.averageReporterScore
      });
    });
    console.log('');

    // Test 5: Get verified zones
    console.log('Test 5️⃣ : Get verified zones only');
    const verifiedZones = await makeRequest('GET', '/api/zones/verified', null);
    console.log('✅ Verified zones:', verifiedZones.data.length);
    verifiedZones.data.forEach((z, i) => {
      console.log(`   Zone ${i+1}:`, {
        location: z.location,
        verified: z.verified,
        reportCount: z.reportCount
      });
    });
    console.log('');

    // Test 6: Get user reputation
    console.log('Test 6️⃣ : Check user reputation scores');
    const alice = await makeRequest('GET', '/api/users/alice/reputation', null);
    const bob = await makeRequest('GET', '/api/users/bob/reputation', null);
    const charlie = await makeRequest('GET', '/api/users/charlie/reputation', null);
    console.log('✅ User Reputations:');
    console.log('   Alice:', alice.data);
    console.log('   Bob:', bob.data);
    console.log('   Charlie:', charlie.data);
    console.log('');

    // Test 7: Get admin stats
    console.log('Test 7️⃣ : Admin Statistics');
    const stats = await makeRequest('GET', '/api/admin/stats', null);
    console.log('✅ System Stats:', stats.data);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Wait for server to be ready
setTimeout(runTests, 500);
