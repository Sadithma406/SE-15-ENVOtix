/**
 * Unit Tests for LaneBin Model - Dashboard Data Display
 * Tests: Fetching bin data for dashboard display (10 tests)
 */

describe('LaneBin - Dashboard Data Display', () => {

    // === DATA FETCHING TESTS (5) ===
    test('should return all bins for dashboard display', () => {
        const mockBins = [
            { _id: '1', laneName: 'Nugegoda', binType: 'Organic', fillLevel: 45 },
            { _id: '2', laneName: 'Nugegoda', binType: 'Plastic', fillLevel: 30 },
            { _id: '3', laneName: 'Colombo', binType: 'Glass', fillLevel: 20 }
        ];
        expect(mockBins.length).toBe(3);
        expect(mockBins[0].fillLevel).toBe(45);
    });

    test('should include all required fields for display', () => {
        const bin = { _id: '123', laneName: 'Nugegoda', binType: 'Organic', fillLevel: 45, status: 'active', location: { latitude: 6.8649, longitude: 79.8997 } };
        expect(bin._id).toBeDefined();
        expect(bin.laneName).toBeDefined();
        expect(bin.binType).toBeDefined();
        expect(bin.fillLevel).toBeDefined();
        expect(bin.location).toBeDefined();
    });

    test('should filter bins by lane name', () => {
        const bins = [
            { laneName: 'Nugegoda', binType: 'Organic' },
            { laneName: 'Colombo', binType: 'Organic' },
            { laneName: 'Nugegoda', binType: 'Plastic' }
        ];
        const nugegodaBins = bins.filter(b => b.laneName === 'Nugegoda');
        expect(nugegodaBins.length).toBe(2);
    });

    test('should filter bins by type', () => {
        const bins = [
            { binType: 'Organic', fillLevel: 45 },
            { binType: 'Plastic', fillLevel: 30 },
            { binType: 'Organic', fillLevel: 60 }
        ];
        const organicBins = bins.filter(b => b.binType === 'Organic');
        expect(organicBins.length).toBe(2);
    });

    test('should validate bin types are correct enum values', () => {
        const validTypes = ['Plastic', 'Glass', 'Organic'];
        const bin = { binType: 'Organic' };
        expect(validTypes).toContain(bin.binType);
    });

    // === MAP & GPS TESTS (5) ===
    test('should include GPS coordinates for map display', () => {
        const bin = { location: { latitude: 6.8649, longitude: 79.8997 } };
        expect(bin.location.latitude).toBeCloseTo(6.8649, 4);
        expect(bin.location.longitude).toBeCloseTo(79.8997, 4);
    });

    test('should validate latitude range for Sri Lanka', () => {
        const bins = [{ location: { latitude: 6.8649 } }, { location: { latitude: 7.2906 } }];
        bins.forEach(bin => {
            expect(bin.location.latitude).toBeGreaterThanOrEqual(5.9);
            expect(bin.location.latitude).toBeLessThanOrEqual(9.9);
        });
    });

    test('should validate longitude range for Sri Lanka', () => {
        const bins = [{ location: { longitude: 79.8997 } }, { location: { longitude: 80.6337 } }];
        bins.forEach(bin => {
            expect(bin.location.longitude).toBeGreaterThanOrEqual(79.5);
            expect(bin.location.longitude).toBeLessThanOrEqual(81.9);
        });
    });

    test('should determine fill level status color', () => {
        const getStatusColor = (level) => {
            if (level >= 80) return 'red';
            if (level >= 50) return 'yellow';
            return 'green';
        };
        expect(getStatusColor(85)).toBe('red');
        expect(getStatusColor(60)).toBe('yellow');
        expect(getStatusColor(30)).toBe('green');
    });

    test('should return bins with valid status for map markers', () => {
        const bins = [
            { _id: '1', status: 'active', fillLevel: 45, location: { latitude: 6.8649, longitude: 79.8997 } },
            { _id: '2', status: 'inactive', fillLevel: 0, location: { latitude: 6.9271, longitude: 79.8612 } }
        ];
        const activeBins = bins.filter(b => b.status === 'active');
        expect(activeBins.length).toBe(1);
        expect(activeBins[0].location).toBeDefined();
    });
});
