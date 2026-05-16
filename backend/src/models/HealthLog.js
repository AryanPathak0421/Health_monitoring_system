const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    heartRate: { type: Number, required: true },
    spO2: { type: Number, required: true },
    temperature: { type: Number, required: true },
    fallDetected: { type: Boolean, default: false },
    gps: {
        latitude: Number,
        longitude: Number
    },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
