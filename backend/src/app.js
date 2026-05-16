const express = require('express');
const app = express();
const healthRoutes = require('./routes/healthRoutes');

app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Emergency Health Monitoring Backend is running.');
});

module.exports = app;
