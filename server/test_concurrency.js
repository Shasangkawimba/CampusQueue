// Removed node-fetch

async function testTakeTicketConcurrency() {
  console.log('Testing Take Ticket Concurrency...');
  
  // Create 5 simultaneous requests to take a ticket for loket 1
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(
      fetch('http://localhost:3000/api/loket/1/take-ticket', { method: 'POST' })
        .then(res => res.json())
        .catch(err => ({ error: err }))
    );
  }

  const results = await Promise.all(promises);
  results.forEach((res, i) => {
    if (res.data) {
      console.log(`Req ${i}: Ticket ${res.data.number}`);
    } else {
      console.log(`Req ${i}: Error`, res);
    }
  });
}

async function testCallNextConcurrency() {
  console.log('\nTesting Call Next Concurrency...');
  
  // Login to get token first
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin_a', password: 'password123' })
  }).then(res => res.json());

  const token = loginRes.token;

  // Create 3 simultaneous requests to call next for loket 1
  const promises = [];
  for (let i = 0; i < 3; i++) {
    promises.push(
      fetch('http://localhost:3000/api/loket/1/call-next', { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .catch(err => ({ error: err }))
    );
  }

  const results = await Promise.all(promises);
  results.forEach((res, i) => {
    if (res.data) {
      console.log(`Req ${i}: Called Ticket ID ${res.data.id} - Number ${res.data.number}`);
    } else {
      console.log(`Req ${i}: Output`, res);
    }
  });
}

async function run() {
  await testTakeTicketConcurrency();
  await testCallNextConcurrency();
}

run();
