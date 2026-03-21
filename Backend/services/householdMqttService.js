const mqtt = require('mqtt');
const SegregateBin = require('../models/segregateBin');
const Notification = require('../models/notification');
const User = require('../models/user');

// Hardcoded segregate bin MongoDB _id (only one bin for now — change later for multiple bins)
const SEGREGATE_BIN_OBJECT_ID = "697825c9fdf4e79038144d32";

const initHouseholdMQTT = () => {
    const client = mqtt.connect('mqtt://broker.hivemq.com');

    client.on('connect', () => {
        console.log("Household MQTT Service: Active");
        client.subscribe('envotix/household/fill');
        client.subscribe('envotix/household/result');
    });

    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());

            // DEBUG: Log all incoming messages
            console.log(`[Household][${topic}]`, data);

            // ROUTE 1: FILL LEVELS from ultrasonic sensors
            // Expected payload: { "binId": "40247c61", "organic": 45, "plastic": 12, "paper": 78 }
            if (topic === 'envotix/household/fill') {
                const { binId, organic, plastic, paper } = data;
                if (!binId) return;

                const now = new Date().toISOString();

                await SegregateBin.findOneAndUpdate(
                    { bin_id: binId },
                    {
                        $set: {
                            status: getOverallStatus(organic, plastic, paper),
                            'organic.fill_level': organic ?? 0,
                            'organic.last_updated': now,
                            'plastic.fill_level': plastic ?? 0,
                            'plastic.last_updated': now,
                            'paper.fill_level': paper ?? 0,
                            'paper.last_updated': now
                        }
                    },
                    { upsert: true, new: true }
                );
                console.log(`[Household] Updated bin ${binId}: O=${organic}% P=${plastic}% G=${paper}%`);

                // Check each compartment — send notifications if any is full (100%)
                const compartments = [
                    { name: 'Organic', level: organic ?? 0 },
                    { name: 'Plastic', level: plastic ?? 0 },
                    { name: 'Paper', level: paper ?? 0 }
                ];

                for (const comp of compartments) {
                    if (comp.level >= 100) {
                        // Find the bin owner: the user whose RFID matches the bin_id
                        const binOwner = await User.findOne({ RFID: binId });

                        if (binOwner) {
                            await new Notification({
                                recipientId: binOwner._id.toString(),
                                title: `${comp.name} Bin Full`,
                                message: `The ${comp.name.toLowerCase()} bin is at 100% capacity. Please empty it to the lane bin.`
                            }).save();
                            console.log(`[Household] ${comp.name} bin FULL — notification sent to ${binOwner.name} (${binOwner._id})`);
                        } else {
                            console.log(`[Household] ${comp.name} bin FULL — no user found with RFID ${binId}`);
                        }
                    }
                }
            }

            // ROUTE 2: CLASSIFICATION RESULT from ML server
            // Expected payload: { "binId": "HB001", "result": "Plastic", "confidence": 87.5 }
            if (topic === 'envotix/household/result') {
                const { binId, result, confidence } = data;
                console.log(`[Household] Classification: ${result} (${confidence}%) for bin ${binId}`);
            }

        } catch (err) {
            console.error("[Household] MQTT Error:", err.message);
        }
    });
};

// Determine overall bin status from the three compartment fill levels
function getOverallStatus(organic, plastic, paper) {
    const maxFill = Math.max(organic || 0, plastic || 0, paper || 0);
    if (maxFill >= 90) return 'full';
    if (maxFill >= 70) return 'warning';
    return 'active';
}

module.exports = initHouseholdMQTT;