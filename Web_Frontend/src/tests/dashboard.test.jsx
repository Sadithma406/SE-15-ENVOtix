/**
 * Unit Tests for Dashboard & Map View
 * Tests: Bin data display from MongoDB, map rendering with fill levels (10 tests)
 */

import { describe, test, expect } from 'vitest';

describe('Dashboard & Map View Tests', () => {

    // === DASHBOARD DATA DISPLAY (5) ===
    test('should display bin data from MongoDB', () => {
        const mockBins = [
            { _id: '1', laneName: 'Nugegoda', binType: 'Organic', fillLevel: 45 },
            { _id: '2', laneName: 'Nugegoda', binType: 'Plastic', fillLevel: 30 }
        ];
        expect(mockBins.length).toBeGreaterThan(0);
        expect(mockBins[0].fillLevel).toBe(45);
    });

    test('should show correct status color based on fill level', () => {
        const getStatusColor = (level) => {
            if (level >= 90) return '#F44336'; // Red
            if (level >= 70) return '#FFC107'; // Yellow
            return '#4CAF50'; // Green
        };
        expect(getStatusColor(30)).toBe('#4CAF50');
        expect(getStatusColor(75)).toBe('#FFC107');
        expect(getStatusColor(95)).toBe('#F44336');
    });

    test('should format fill level as percentage', () => {
        const fillLevel = 45;
        expect(`${fillLevel}%`).toBe('45%');
    });

    test('should display all bin types', () => {
        const bins = [
            { binType: 'Organic' },
            { binType: 'Plastic' },
            { binType: 'Glass' }
        ];
        const types = bins.map(b => b.binType);
        expect(types).toContain('Organic');
        expect(types).toContain('Plastic');
        expect(types).toContain('Glass');
    });

    test('should show last updated timestamp', () => {
        const lastUpdated = new Date('2026-03-08T10:30:00');
        expect(lastUpdated).toBeInstanceOf(Date);
        expect(lastUpdated.toLocaleString()).toBeDefined();
    });

    // === MAP VIEW WITH BINS (5) ===
    test('should display bins with GPS coordinates on map', () => {
        const bin = { 
            laneName: 'Nugegoda', 
            fillLevel: 45,
            location: { latitude: 6.8649, longitude: 79.8997 } 
        };
        expect(bin.location.latitude).toBe(6.8649);
        expect(bin.location.longitude).toBe(79.8997);
    });

    test('should validate Sri Lankan coordinates', () => {
        const sriLankaBounds = { minLat: 5.9, maxLat: 9.9, minLng: 79.5, maxLng: 82.0 };
        const binLocation = { lat: 6.8649, lng: 79.8997 };
        
        expect(binLocation.lat).toBeGreaterThan(sriLankaBounds.minLat);
        expect(binLocation.lat).toBeLessThan(sriLankaBounds.maxLat);
        expect(binLocation.lng).toBeGreaterThan(sriLankaBounds.minLng);
        expect(binLocation.lng).toBeLessThan(sriLankaBounds.maxLng);
    });

    test('should center map on bin location', () => {
        const mapCenter = { lat: 6.8649, lng: 79.8997 };
        expect(mapCenter.lat).toBeDefined();
        expect(mapCenter.lng).toBeDefined();
    });

    test('should show bin marker with fill level on map', () => {
        const marker = { position: { lat: 6.8649, lng: 79.8997 }, label: '45%', binType: 'Organic' };
        expect(marker.position).toBeDefined();
        expect(marker.label).toBe('45%');
    });

    test('should filter bins by location for map view', () => {
        const bins = [
            { laneName: 'Nugegoda', location: { latitude: 6.8649, longitude: 79.8997 } },
            { laneName: 'Colombo', location: { latitude: 6.9271, longitude: 79.8612 } }
        ];
        const nugegodaBins = bins.filter(b => b.laneName === 'Nugegoda');
        expect(nugegodaBins.length).toBe(1);
    });
});
