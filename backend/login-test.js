// simple-login-test.js
import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log("Testing admin login...");
    
    // Change the URL if your API endpoint is different
    const response = await fetch('http://localhost:8000/api/auth/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'password123'
      })
    });
    
    console.log("Response status:", response.status);
    
    // Parse the response
    const data = await response.json();
    console.log("Response body:", JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log("\n✅ Login successful!");
    } else {
      console.log("\n❌ Login failed.");
    }
  } catch (error) {
    console.error("Error testing login:", error);
  }
}

testLogin();