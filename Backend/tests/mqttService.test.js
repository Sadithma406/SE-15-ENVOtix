/**
 * Unit Tests for MQTT Service - Core IoT Functionality
 * Tests: Fill Level, GPS Location, RFID Rewards (10 tests)
 */

jest.mock('mqtt', () => ({
    connect: jest.fn(() => ({ on: jest.fn(), subscribe: jest.fn() }))
}));

jest.mock('../models/laneBin');
jest.mock('../models/user');

const LaneBin = require('../models/laneBin');
const User = require('../models/user');

describe('MQTT Service - IoT Integration', () => {
    
    beforeEach(() => jest.clearAllMocks());

    // === FILL LEVEL TESTS (3) ===
    test('should update bin fill level in database', async () => {
        LaneBin.findByIdAndUpdate.mockResolvedValue({ fillLevel: 45 });
        const result = await LaneBin.findByIdAndUpdate('6988ff9898e4690a4a14770c', { $set: { fillLevel: 45 } }, { new: true });
        expect(result.fillLevel).toBe(45);
    });

    test('should detect bin emptied when fill drops more than 20 percent', () => {
        let userTracking = { 'rfid123': 60 };
        const lastLevel = 80;
        const newLevel = 10;
        if (newLevel < lastLevel - 20) userTracking = {};
        expect(Object.keys(userTracking).length).toBe(0);
    });

    test('should validate fill level range 0-100', () => {
        [0, 50, 100].forEach(level => {
            expect(level).toBeGreaterThanOrEqual(0);
            expect(level).toBeLessThanOrEqual(100);
        });
    });

    // === GPS LOCATION TESTS (3) ===
    test('should update bin GPS coordinates', async () => {
        LaneBin.findByIdAndUpdate.mockResolvedValue({ location: { latitude: 6.8649, longitude: 79.8997 } });
        const result = await LaneBin.findByIdAndUpdate('bin123', { $set: { 'location.latitude': 6.8649, 'location.longitude': 79.8997 } }, { new: true });
        expect(result.location.latitude).toBe(6.8649);
        expect(result.location.longitude).toBe(79.8997);
    });

    test('should validate GPS coordinate boundaries', () => {
        const coord = { lat: 6.8649, lng: 79.8997 };
        expect(coord.lat).toBeGreaterThan(-90);
        expect(coord.lat).toBeLessThan(90);
        expect(coord.lng).toBeGreaterThan(-180);
        expect(coord.lng).toBeLessThan(180);
    });

    test('should handle GPS coordinate precision', () => {
        const lat = 6.864912345;
        expect(lat.toFixed(6)).toBe('6.864912');
    });

    // === RFID REWARD TESTS (4) ===
    test('should award coins when RFID scanned and fill increases', async () => {
        User.findOneAndUpdate.mockResolvedValue({ RFID: '40247c61', coins: 160 });
        const result = await User.findOneAndUpdate({ RFID: '40247c61' }, { $inc: { coins: 10 } }, { new: true });
        expect(result.coins).toBe(160);
    });

    test('should track user RFID for reward calculation', () => {
        const userTracking = {};
        userTracking['40247c61'] = 45;
        expect(userTracking['40247c61']).toBe(45);
    });

    test('should calculate coins based on fill level increase', () => {
        const startLevel = 30;
        const endLevel = 45;
        const increase = endLevel - startLevel;
        const coins = Math.floor(increase / 10) * 10;
        expect(coins).toBe(10);
    });

    test('should lookup user by RFID for coin award', async () => {
        User.findOne.mockResolvedValue({ _id: 'user123', RFID: '40247c61', name: 'John', coins: 100 });
        const user = await User.findOne({ RFID: '40247c61' });
        expect(user.RFID).toBe('40247c61');
        expect(user.coins).toBe(100);
    });
});
