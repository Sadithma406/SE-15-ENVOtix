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
    });

    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());

            // ROUTE 1: FILL LEVEL
            if (topic === 'envotix/lane/updates') {
                const { binId, fillLevel } = data;
                if (!binId) return;

                // If bin was emptied (drop >20%), reset all user tracking
                if (fillLevel < lastKnownFillLevel - 20) {
                    userLastRewardedLevel = {};
                }
                lastKnownFillLevel = fillLevel;

                await LaneBin.findByIdAndUpdate(
                    binId, 
                    { $set: { fillLevel: fillLevel, lastUpdated: new Date() } },
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

            // ROUTE 3: RFID REWARDS - Award coins based on fill level increase
            if (topic === 'envotix/user/rfidTap') {
                const { rfidTag } = data;
                if (!rfidTag) return;

                const bin = await LaneBin.findById(NUGEGODA_ORGANIC_BIN_ID);
                if (!bin) return;

                const currentLevel = bin.fillLevel;
                const userLastLevel = userLastRewardedLevel[rfidTag] ?? currentLevel;
                const difference = Math.max(0, currentLevel - userLastLevel);
                
                if (difference > 0) {
                    const totalCoins = difference * 2;
                    const userResult = await User.findOneAndUpdate(
                        { RFID: rfidTag },
                        { 
                            $inc: { coin_balance: totalCoins },
                            $set: { coin_last_updated: new Date() } 
                        },
                        { new: true }
                    );
                    
                    if (userResult) {
                        console.log(`${totalCoins} coins → ${userResult.name} (${userResult.coin_balance} total)`);
                    }
                }
                
                // Always update user's last rewarded level
                userLastRewardedLevel[rfidTag] = currentLevel;
            }
        } catch (err) {
            console.error("MQTT Error:", err.message);
        }
    });
};

module.exports = initMQTT;