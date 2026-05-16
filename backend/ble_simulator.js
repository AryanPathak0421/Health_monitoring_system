const axios = require('axios');

const DUMMY_USER_ID = '6643c5685eb5423bbc457d16';
const API_URL = 'http://localhost:5000/api/health/data';

console.log('Starting BLE Watch Simulator...');

const sendVitals = async () => {
    // Simulating health data as if coming from a real BLE watch
    const data = {
        userId: DUMMY_USER_ID,
        heartRate: Math.floor(Math.random() * (100 - 60) + 60), // Normal range
        spO2: Math.floor(Math.random() * (100 - 95) + 95),     // Normal range
        temperature: Number((Math.random() * (37.5 - 36.5) + 36.5).toFixed(1)),
        fallDetected: Math.random() < 0.05, // 5% chance of fall
        gps: {
            latitude: 22.7196 + (Math.random() - 0.5) * 0.01,
            longitude: 75.8577 + (Math.random() - 0.5) * 0.01
        }
    };

    try {
        await axios.post(API_URL, data);
        console.log(`[BLE SIMULATOR] Data Sent: HR=${data.heartRate} bpm, SpO2=${data.spO2}%`);
    } catch (error) {
        console.error('[BLE SIMULATOR] Error sending data:', error.message);
    }
};

// Send data every 3 seconds
setInterval(sendVitals, 3000);
