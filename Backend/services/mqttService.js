const mqtt = require('mqtt');
const LaneBin = require('../models/laneBin');
const User = require('../models/user');

const NUGEGODA_ORGANIC_BIN_ID = "6988ff9898e4690a4a14770c";

// Track last rewarded fill level per user (by RFID)
let userLastRewardedLevel = {};
let lastKnownFillLevel = 0;

const initMQTT = () => {
    const client = mqtt.connect('mqtt://broker.hivemq.com');

    client.on('connect', () => {
        console.log("MQTT Service: Active");
        client.subscribe('envotix/lane/updates');
        client.subscribe('envotix/user/rfidTap');
        client.subscribe('envotix/lane/location');
    });    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());
            
            // DEBUG: Log all incoming messages
            console.log(`[${topic}]`, data);

            // ROUTE 1: FILL LEVEL
            if (topic === 'envotix/lane/updates') {
                const { binId, fillLevel } = data;
                if (!binId) return;

                // If bin was emptied (drop >20%), reset all user tracking
                if (fillLevel < lastKnownFillLevel - 20) {
                    userLastRewardedLevel = {};
                }
                lastKnownFillLevel = fillLevel;

                // Calculate status based on fill level
                let status = 'active';
                if (fillLevel >= 90) status = 'full';
                else if (fillLevel >= 70) status = 'warning';

                await LaneBin.findByIdAndUpdate(
                    binId, 
                    { $set: { fillLevel: fillLevel, status: status, lastUpdated: new Date() } },
                    { new: true }
                );
            }

            // ROUTE 2: GPS LOCATION
            if (topic === 'envotix/lane/location') {
                const { binId, lat, lng } = data;
                if (!binId || lat === undefined || lng === undefined) return;

                await LaneBin.findByIdAndUpdate(
                    binId, 
                    { 
                        $set: { 
                            "location.latitude": lat,
                            "location.longitude": lng,
                            lastUpdated: new Date() 
                        } 
                    },
                    { new: true }
                );
            }

            // ROUTE 3: RFID REWARDS - Award 1 coin per tap (TEST MODE)
            if (topic === 'envotix/user/rfidTap') {
                const { rfidTag } = data;
                if (!rfidTag) return;

                await User.findOneAndUpdate(
                    { RFID: rfidTag },
                    { 
                        $inc: { coin_balance: 1 },
                        $set: { coin_last_updated: new Date() } 
                    },
                    { new: true }
                );
            }
        } catch (err) {
            // Silent error handling
        }
    });
};

module.exports = initMQTT;