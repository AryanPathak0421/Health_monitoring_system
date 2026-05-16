const axios = require('axios');

const API_URL = 'http://localhost:5000/api/health/data';
const DUMMY_USER_ID = '6643c5685eb5423bbc457d16'; // Valid ObjectId format

const generateData = () => {
    // 10% chance of emergency
    const isEmergency = Math.random() < 0.1;
    
    let heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    let spO2 = Math.floor(Math.random() * (100 - 95 + 1)) + 95;
    let temperature = parseFloat((Math.random() * (37.5 - 36.5) + 36.5).toFixed(1));
    let fallDetected = Math.random() < 0.05; // 5% chance of fall

    if (isEmergency) {
        // Simulate abnormal data
        const type = Math.random();
        if (type < 0.33) {
            heartRate = Math.floor(Math.random() * (150 - 120 + 1)) + 120; // High HR
        } else if (type < 0.66) {
            spO2 = Math.floor(Math.random() * (89 - 80 + 1)) + 80; // Low SpO2
        } else {
            fallDetected = true;
        }
    }

    return {
        userId: DUMMY_USER_ID,
        heartRate,
        spO2,
        temperature,
        fallDetected,
        gps: {
            latitude: 28.6139, // Default to Delhi coordinates
            longitude: 77.2090
        }
    };
};

const sendData = async () => {
    const data = generateData();
    console.log('Sending data:', data);
    
    try {
        const response = await axios.post(API_URL, data);
        console.log('Server response:', response.data);
    } catch (error) {
        console.error('Error sending data:', error.message);
    }
};

// Send data every 5 seconds
console.log('Simulator started...');
setInterval(sendData, 5000);
