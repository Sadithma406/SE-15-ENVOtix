import React,{useState, useCallback} from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    Image, 
    Platform, 
    TouchableOpacity, 
    StatusBar,
} from 'react-native';
import { ChevronLeft, Bell, Menu, ChevronRight, Home, Wallet, Store } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import API_BASE_URL from '../config/api';

export default function MonitorScreen({ navigation, route }) {
    // 1. Catch the userId passed from HomeScreen/Login
    const userId = route?.params?.userId;

    // State for each bin type
    const [organicData, setOrganicData] = useState({ fill: '...', time: 'Loading...' });
    const [plasticData, setPlasticData] = useState({ fill: '...', time: 'Loading...' });
    const [glassData, setGlassData] = useState({ fill: '...', time: 'Loading...' });

    // 2. Fetch Function
    const fetchBinLevels = async () => {
        if (!userId) return; // Guard clause if userId is missing

        try {
            // First: Fetch user profile to get their specific RFID
            const userResponse = await fetch(`${API_BASE_URL}/api/users/${userId}`);
            const userData = await userResponse.json();

            if (userData && userData.RFID) {
                // Second: Fetch bin levels using the dynamic RFID
                const response = await fetch(`${API_BASE_URL}/api/bins/${userData.RFID}`); 
                const binData = await response.json();

                if (binData) {
                    if (binData.organic) {
                        setOrganicData({ 
                            fill: `${binData.organic.fill_level}%`, 
                            time: new Date(binData.organic.last_updated).toLocaleTimeString() 
                        });
                    }
                    if (binData.plastic) {
                        setPlasticData({ 
                            fill: `${binData.plastic.fill_level}%`, 
                            time: new Date(binData.plastic.last_updated).toLocaleTimeString() 
                        });
                    }
                    if (binData.glass) {
                        setGlassData({ 
                            fill: `${binData.glass.fill_level}%`, 
                            time: new Date(binData.glass.last_updated).toLocaleTimeString() 
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching bin levels:", error);
        }
    };

    // Use useFocusEffect to refetch data every time the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log("MonitorScreen focused, userId:", userId);
            fetchBinLevels();
            
            // Set up interval for periodic refresh
            const interval = setInterval(fetchBinLevels, 30000);
            
            // Cleanup interval when screen loses focus
            return () => clearInterval(interval);
        }, [userId])
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#4CAF50" />
            <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>
                
                {/* Header */}
                <View style={styles.header}>
                    <Image source={require('../../assets/whiteLogoNoBg2.png')} style={styles.logo} resizeMode="contain" />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerBaseText}>
                            <Text style={styles.envoText}>ENVO</Text>
                            <Text style={styles.tixText}>tix</Text>
                        </Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate('Notification', { userId })}>
                            <Bell color="black" size={24} style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('SideBar', { userId })}>
                            <Menu color="black" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sub Header */}
                <View style={styles.subHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft color="#333" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle}>Monitor My Bin</Text>
                </View>

                {/* Waste Cards - Passing userId to the detail screens */}
                <TouchableOpacity style={styles.wasteCard} onPress={() => navigation.navigate('Organic', { userId })}>
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeft}>
                            <Image source={require('../../assets/organic.png')} style={styles.wasteIcon} resizeMode="contain" />
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.wasteType}>Organic Waste</Text>
                                <Text style={styles.fillPercentage}>{organicData.fill}</Text>
                                <Text style={styles.lastUpdated}>Last Updated: {organicData.time}</Text>
                            </View>
                        </View>
                        <ChevronRight color="#666" size={24} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.wasteCard} onPress={() => navigation.navigate('Plastic', { userId })}>
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeft}>
                            <Image source={require('../../assets/plastic.png')} style={styles.wasteIcon} resizeMode="contain" />
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.wasteType}>Plastic Waste</Text>
                                <Text style={styles.fillPercentage}>{plasticData.fill}</Text>
                                <Text style={styles.lastUpdated}>Last Updated: {plasticData.time}</Text>
                            </View>
                        </View>
                        <ChevronRight color="#666" size={24} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.wasteCard} onPress={() => navigation.navigate('Glass', { userId })}>
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeft}>
                            <Image source={require('../../assets/glass.png')} style={styles.wasteIcon} resizeMode="contain" />
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.wasteType}>Glass Waste</Text>
                                <Text style={styles.fillPercentage}>{glassData.fill}</Text>
                                <Text style={styles.lastUpdated}>Last Updated: {glassData.time}</Text>
                            </View>
                        </View>
                        <ChevronRight color="#666" size={24} />
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Home', { userId })}>
                    <Home color="#666" size={24} />
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Coins', { userId })}>
                    <Wallet color="#666" size={24} />
                    <Text style={styles.footerText}>Coins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Shops', { userId })}>
                    <Store color="#666" size={24} />
                    <Text style={styles.footerText}>Shops</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
    scrollContent: { padding: 20 },
    header: { backgroundColor: '#4CAF50', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 9, alignItems: 'center', marginTop: -20, marginHorizontal: -20, paddingTop: 20 },
    logo: { width: 40, height: 40, borderRadius: 20 },
    headerTextContainer: { flex: 1, alignItems: 'center' },
    envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
    tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
    headerIcons: { flexDirection: 'row' },
    subHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 },
    subHeaderTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 10, color: '#333' },
    wasteCard: { backgroundColor: '#E8E8E8', borderRadius: 12, marginBottom: 15, padding: 18, elevation: 2 },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    wasteIcon: { width: 35, height: 35, marginRight: 12 },
    cardTextContainer: { flex: 1 },
    wasteType: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
    fillPercentage: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 4 },
    lastUpdated: { fontSize: 13, color: '#666' },
    footer: { flexDirection: 'row', height: 70, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#EEE', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 20 : 10 },
    footerTab: { alignItems: 'center', justifyContent: 'center' },
    footerText: { fontSize: 12, marginTop: 4, color: '#666', fontWeight: '500' },
});