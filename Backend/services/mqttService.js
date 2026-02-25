const mqtt = require('mqtt');
const LaneBin = require('../models/laneBin');

const initMQTT = () => {
    const client = mqtt.connect('mqtt://broker.hivemq.com');

    client.on('connect', () => {
        console.log("MQTT Service: Connected and Listening");
        client.subscribe('envotix/lane/updates');
    });

    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());
            
            // Logic for Ultrasonic Sensor
            let newStatus = 'active';
            if (data.fillLevel >= 90) newStatus = 'full';
            else if (data.fillLevel >= 70) newStatus = 'warning';

            await LaneBin.findByIdAndUpdate(data.binId, {
                $set: {
                    fillLevel: data.fillLevel,
                    status: newStatus,
                    lastUpdated: new Date()
                }
            });
            
            console.log(`Sensor Update: Bin ${data.binId} is at ${data.fillLevel}%`);
        } catch (err) {
            console.error("MQTT Service Error:", err);
        }
    });
};

module.exports = initMQTT;