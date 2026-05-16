const HealthLog = require('../models/HealthLog');
const { checkThresholds } = require('../services/alertService');
const { validateHealthData } = require('../utils/validators');

exports.saveHealthData = async (req, res) => {
    try {
        const { userId, heartRate, spO2, temperature, fallDetected, gps } = req.body;
        
        const validation = validateHealthData({ heartRate, spO2, temperature });
        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }
        
        const log = new HealthLog({
            userId,
            heartRate,
            spO2,
            temperature,
            fallDetected,
            gps
        });

        await log.save();

        // Check for emergency thresholds
        const alerts = await checkThresholds(userId, { heartRate, spO2, fallDetected });

        // Broadcast via Socket.IO
        const io = req.app.get('io');
        console.log('[SOCKET] IO Instance found?', !!io);
        if (io) {
            console.log('[SOCKET] Emitting vitalsUpdate for user:', userId);
            io.emit('vitalsUpdate', { log, alerts });
        } else {
            console.warn('[SOCKET] IO instance not found in app!');
        }

        res.status(201).json({ success: true, data: log, alerts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
