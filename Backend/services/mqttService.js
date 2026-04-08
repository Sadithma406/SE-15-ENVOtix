const mqtt = require('mqtt');
const LaneBin = require('../models/laneBin');
const User = require('../models/user');
const Notification = require('../models/notification');

const NUGEGODA_ORGANIC_BIN_ID = "6988ff9898e4690a4a14770c";

// Lane bin height configuration
// Arduino code uses 80cm, but the actual bin height is 51cm
const ARDUINO_BIN_HEIGHT = 80;   // cm — what the Arduino thinks the bin height is
const ACTUAL_BIN_HEIGHT = 51;   // cm — the real bin height (measured: empty bin reads ~51cm distance)

/**
 * Recalculates fill level from Arduino's value to the correct value.
 * Arduino calculates:  fillLevel = ((80 - distance) / 80) * 100
 * We reverse to get distance, then recalculate with the real height (55cm).
 */
function recalcFillLevel(arduinoFillLevel) {
    // Reverse: get actual sensor distance from Arduino's fill level
    const distance = ARDUINO_BIN_HEIGHT * (1 - arduinoFillLevel / 100);

    // Recalculate with actual bin height
    let corrected = ((ACTUAL_BIN_HEIGHT - distance) / ACTUAL_BIN_HEIGHT) * 100;

    // Clamp to 0–100
    if (corrected < 0) corrected = 0;
    if (corrected > 100) corrected = 100;

    return Math.round(corrected);
}

// Tracks the current corrected fill level (%)
let lastKnownFillLevel = 0;

// The fill level at the moment of the last RFID tap.
// Coins are awarded based on: (currentFill - fillAtLastTap)
// This way, any garbage added between taps is always counted.
let fillAtLastTap = 0;

// Track which bin last had a fill increase (so we know the bin type on RFID tap)
let lastFillBinId = null;

const initMQTT = () => {
    const client = mqtt.connect('mqtt://broker.hivemq.com');

    client.on('connect', () => {
        console.log("MQTT Service: Active");
        client.subscribe('envotix/lane/updates');
        client.subscribe('envotix/user/rfidTap');
        client.subscribe('envotix/lane/location');
    }); client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());

            // ROUTE 1: FILL LEVEL
            if (topic === 'envotix/lane/updates') {
                const { binId, fillLevel } = data;
                if (!binId) return;

                // Recalculate fill level (Arduino uses 80cm, actual bin is 51cm)
                const correctedFill = recalcFillLevel(fillLevel);
                console.log(`[envotix/lane/updates] { binId: '${binId}', fillLevel: ${correctedFill} }`);

                // Track which bin had a fill increase (for the reward message)
                if (correctedFill > lastKnownFillLevel) {
                    lastFillBinId = binId;
                }

                // Detect bin emptied: if fill drops by 30%+ it means the collector emptied the bin
                // Reset fillAtLastTap so the next user isn't penalized
                if (lastKnownFillLevel - correctedFill >= 30) {
                    fillAtLastTap = correctedFill;
                    console.log(`[Lane] Bin emptied detected! Baseline reset to ${correctedFill}%`);
                }

                lastKnownFillLevel = correctedFill;

                // Calculate status based on corrected fill level
                let status = 'active';
                if (correctedFill >= 90) status = 'full';
                else if (correctedFill >= 70) status = 'warning';

                await LaneBin.findByIdAndUpdate(
                    binId,
                    { $set: { fillLevel: correctedFill, status: status, lastUpdated: new Date() } },
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

            // ROUTE 3: RFID TAP — Award coins based on fill increase since last tap
            if (topic === 'envotix/user/rfidTap') {
                const { rfidTag } = data;
                if (!rfidTag) return;

                // Calculate the fill increase since the last RFID tap
                const fillIncrease = lastKnownFillLevel - fillAtLastTap;

                if (fillIncrease > 0) {
                    // Award 1 coin for every 10% increase
                    const coinsEarned = Math.floor(fillIncrease / 10);

                    if (coinsEarned > 0) {
                        // Look up the bin type for the history message
                        let binTypeName = 'lane';
                        if (lastFillBinId) {
                            try {
                                const bin = await LaneBin.findById(lastFillBinId);
                                if (bin && bin.binType) {
                                    binTypeName = bin.binType.toLowerCase();
                                }
                            } catch (e) { /* use default */ }
                        }

                        const historyMessage = `Waste added to the ${binTypeName} bin`;

                        const updatedUser = await User.findOneAndUpdate(
                            { RFID: rfidTag },
                            {
                                $inc: { coin_balance: coinsEarned },
                                $set: { coin_last_updated: new Date() },
                                $push: {
                                    coin_history: {
                                        message: historyMessage,
                                        coins: coinsEarned,
                                        date: new Date()
                                    }
                                }
                            },
                            { new: true }
                        );

                        // Create a notification for this user
                        if (updatedUser) {
                            await new Notification({
                                recipientId: updatedUser._id.toString(),
                                title: 'Coins Added',
                                message: `${historyMessage}. +${coinsEarned} coin(s) earned!`
                            }).save();
                        }

                        console.log(`[Reward] RFID ${rfidTag}: +${fillIncrease}% -> ${coinsEarned} coin(s)`);
                    } else {
                        console.log(`[Reward] RFID ${rfidTag}: +${fillIncrease}% — Not enough for a coin (need at least 10%)`);
                    }
                } else {
                    console.log(`[Reward] RFID ${rfidTag}: No fill increase since last tap — 0 coins`);
                }

                // Always reset: remember current fill level for the next tap
                fillAtLastTap = lastKnownFillLevel;
                console.log(`[Reward] Baseline reset to ${fillAtLastTap}% for next tap`);
            }
        } catch (err) {
            // Silent error handling
        }
    });
};

module.exports = initMQTT;