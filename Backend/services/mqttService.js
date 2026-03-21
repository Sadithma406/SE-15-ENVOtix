const mqtt = require('mqtt');
const LaneBin = require('../models/laneBin');
const User = require('../models/user');
const Notification = require('../models/notification');

const NUGEGODA_ORGANIC_BIN_ID = "6988ff9898e4690a4a14770c";

// Lane bin height configuration
// Arduino code uses 80cm, but the actual bin height is 55cm
const ARDUINO_BIN_HEIGHT = 80;   // cm — what the Arduino thinks the bin height is
const ACTUAL_BIN_HEIGHT = 55;   // cm — the real bin height

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

// Coin reward configuration
// 1 coin is awarded for every 5cm of waste dumped into the bin
const CM_PER_COIN = 5;

// Tracks the current corrected fill level (%)
let lastKnownFillLevel = 0;

// The "stable" fill level before any waste was added.
// Only updates when fill stays the same or decreases (not on increase).
// This captures the fill level BEFORE someone dumps waste.
let stableBaseline = 0;

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

            // DEBUG: Log all incoming messages
            console.log(`[${topic}]`, data);

            // ROUTE 1: FILL LEVEL
            if (topic === 'envotix/lane/updates') {
                const { binId, fillLevel } = data;
                if (!binId) return;

                // Recalculate fill level (Arduino uses 80cm, actual bin is 55cm)
                const correctedFill = recalcFillLevel(fillLevel);
                console.log(`[Lane] Fill recalc: Arduino=${fillLevel}% → Corrected=${correctedFill}%`);

                // Update the stable baseline:
                // If fill stayed the same or decreased → update baseline (no dump happening)
                // If fill increased → someone dumped waste, keep baseline where it was
                if (correctedFill <= lastKnownFillLevel) {
                    stableBaseline = correctedFill;
                } else {
                    // Fill increased — remember which bin it was
                    lastFillBinId = binId;
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

                console.log(`[Lane] Baseline: ${stableBaseline}% | Current: ${correctedFill}%`);
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

            // ROUTE 3: RFID TAP — Award coins based on fill increase since baseline
            if (topic === 'envotix/user/rfidTap') {
                const { rfidTag } = data;
                if (!rfidTag) return;

                // 1. Calculate the percentage increase directly
                const fillIncrease = lastKnownFillLevel - stableBaseline;

                if (fillIncrease > 0) {
                    // 2. Award 1 coin for every 10% increase
                    // Example: 10% increase = 1 coin | 100% increase = 10 coins
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

                        console.log(`[Reward] RFID ${rfidTag}: ${historyMessage} | +${fillIncrease}% -> ${coinsEarned} coin(s)`);
                    } else {
                        console.log(`[Reward] RFID ${rfidTag}: +${fillIncrease}% — Not enough for a coin (need at least 10%)`);
                    }

                    // 3. Reset baseline to current level after rewarding
                    stableBaseline = lastKnownFillLevel;
                } else {
                    console.log(`[Reward] RFID ${rfidTag}: No fill increase detected — 0 coins`);
                }
            }
        } catch (err) {
            // Silent error handling
        }
    });
};

module.exports = initMQTT;