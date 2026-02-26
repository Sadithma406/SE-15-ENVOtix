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

            // 🔹 Directly update MongoDB with the raw numeric distance
            await LaneBin.findByIdAndUpdate(data.binId, {
                $set: {
                    fillLevel: data.fillLevel, 
                    lastUpdated: new Date()
                }
            });
            
            console.log(`Updated: Bin ${data.binId} level is now ${data.fillLevel} cm`);
        } catch (err) {
            console.error("Database Update Error:", err);
        }
    });
};

module.exports = initMQTT;