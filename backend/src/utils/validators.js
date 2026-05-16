const validateHealthData = (data) => {
    const { heartRate, spO2, temperature } = data;
    
    if (heartRate !== undefined && (typeof heartRate !== 'number' || heartRate < 0)) {
        return { valid: false, message: 'Invalid heart rate' };
    }
    
    if (spO2 !== undefined && (typeof spO2 !== 'number' || spO2 < 0 || spO2 > 100)) {
        return { valid: false, message: 'Invalid SpO2 level' };
    }
    
    if (temperature !== undefined && (typeof temperature !== 'number' || temperature < 0)) {
        return { valid: false, message: 'Invalid temperature' };
    }
    
    return { valid: true };
};

module.exports = { validateHealthData };
