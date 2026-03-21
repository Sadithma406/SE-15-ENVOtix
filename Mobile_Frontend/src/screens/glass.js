import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView,
  Image,
  Platform, 
  StatusBar,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { ChevronLeft, Bell, Menu, Lightbulb, Home, Wallet, Store } from 'lucide-react-native';
import CircularGauge from '../components/CircularGauge';
import { SafeAreaView } from 'react-native-safe-area-context';
import API_BASE_URL from '../config/api';

const PaperBinScreen = ({ navigation, route }) => {
  // 1. Catch the userId passed from the previous screen
  const userId = route?.params?.userId;

  const [fillLevel, setFillLevel] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('Fetching...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId) {
        setLastUpdated("No User ID found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 2. First, get the user's RFID from the User collection
        const userResponse = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        const userData = await userResponse.json();

        if (userData && userData.RFID) {
          const userRFID = userData.RFID; // This matches "B21938cis9" dynamically

          // 3. Use the dynamic RFID to fetch bin data
          const binResponse = await fetch(`${API_BASE_URL}/api/bins/${userRFID}`);
          const binData = await binResponse.json();

          if (binData && binData.paper) {
            setFillLevel(binData.paper.fill_level);
            setLastUpdated(`Last updated: ${new Date(binData.paper.last_updated).toLocaleTimeString()}`);
          }
        }
      } catch (error) {
        console.error("Error fetching bin data:", error);
        setLastUpdated("Offline - Check Connection");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>

        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/whiteLogoNoBg2.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
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

        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>paper Bin</Text>
        </View>

        <View style={styles.iconTitleSection}>
          <Image 
            source={require('../../assets/glass.png')} 
            style={styles.paperImage} 
            resizeMode="contain"
          />
          <Text style={styles.iconSectionText}>Paper Bin</Text>
        </View> 

        {/* Main Gauge Card */}
        <View style={styles.mainCard}>
          {loading ? (
            <View style={styles.gaugeContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          ) : (
            <>
              <View style={styles.gaugeContainer}>
                <CircularGauge percentage={fillLevel} />
              </View>
              <Text style={styles.updateText}>{lastUpdated}</Text>
            </>
          )}
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Lightbulb color="#4CAF50" size={20} />
            <Text style={styles.tipsTitle}>paper Recycling Tips</Text>
          </View>
          <Text style={styles.tipItem}>• Rinse plastic bottles and containers before placing them in recycling.</Text>
          <Text style={styles.tipItem}>• Avoid throwing plastic waste carelessly as it pollutes the environment.</Text>
          <Text style={styles.tipItem}>•  Reuse plastic containers for storage instead of discarding them immediately.</Text>
          <Text style={styles.tipItem}>• Improper plastic disposal harms wildlife and contaminates land and water.</Text>
        </View>
      </ScrollView>

      {/* Footer Section */}
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
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { 
    backgroundColor: '#4CAF50', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 9, 
    alignItems: 'center',
    marginTop: -20, 
    marginHorizontal: -20,
    paddingTop: 20,
  },
  logo: { width: 40, height: 40, borderRadius: 20 },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  subHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 20 },
  subHeaderTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  paperImage: { width: 55, height: 55, marginRight: 2 },
  iconTitleSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconSectionText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scrollContent: { padding: 20 },
  mainCard: { 
    backgroundColor: 'white', 
    borderRadius: 25, 
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    elevation: 3,
  },
  gaugeContainer: { height: 230, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  updateText: { color: '#666', fontSize: 14, fontWeight: '500', textAlign: 'center' },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 50 },
  tipsTitle: { marginLeft: 10, fontWeight: 'bold', fontSize: 16, color: '#333' },
  tipItem: { color: '#555', marginBottom: 10, lineHeight: 22, fontSize: 14 },
  footer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  footerTab: { alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 12, marginTop: 4, color: '#666', fontWeight: '500' }
});

export default PaperBinScreen;