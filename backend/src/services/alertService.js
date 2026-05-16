const Alert = require('../models/Alert');
const { sendEmail } = require('./notificationService');

/**
 * Checks health data against thresholds and creates alerts if necessary.
 * @param {string} userId - The ID of the user.
 * @param {object} data - The health data (heartRate, spO2, fallDetected).
 */
const checkThresholds = async (userId, data) => {
    const { heartRate, spO2, fallDetected } = data;
    const alerts = [];

    // Thresholds
    if (heartRate > 120 || heartRate < 50) {
        alerts.push({ type: 'HeartRate', message: `Abnormal heart rate detected: ${heartRate} bpm` });
    }

    if (spO2 < 90) {
        alerts.push({ type: 'SpO2', message: `Low SpO2 level detected: ${spO2}%` });
    }

    if (fallDetected) {
        alerts.push({ type: 'Fall', message: 'Fall detected!' });
    }

    // Save alerts to database
    for (const alertData of alerts) {
        const alert = new Alert({
            userId,
            ...alertData
        });
        await alert.save();
        console.log(`[ALERT] ${alertData.message}`);
        
        // Send email alert (Mock caregiver email for now)
        const caregiverEmail = 'caregiver@example.com';
        await sendEmail(caregiverEmail, `EMERGENCY ALERT: ${alertData.type}`, alertData.message);
        
        // TODO: Integrate with Twilio / Firebase here for real notifications
    }

    return alerts;
};

module.exports = { checkThresholds };
