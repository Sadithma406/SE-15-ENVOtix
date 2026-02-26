import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Bell, 
  Menu, 
  CirclePlus, 
  Home, 
  Wallet, 
  Store, 
  RotateCw
} from 'lucide-react-native';

const CoinsScreen = ({ navigation, route }) => {
  // 1. Get the userId passed from LoginScreen params
  const  userId  = route?.params?.userId;

  // 2. State for dynamic data
  const [balance, setBalance] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fetch function using dynamic userId
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
if(!userId){
  console.log("No userId provided");
  setIsLoading(false);
  return;
}      
const response = await fetch(`http://localhost:5000/api/users/${userId}`);
const data = await response.json();

if (data) {
  setBalance(data.coin_balance || 0); // Now matches backend
  
  const date = new Date(data.coin_last_updated); // Now matches backend
  if (!isNaN(date)) {
    setLastUpdated(`Last updated: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`);
  }
}
    } catch (error) {
      console.error("Error fetching user coins:", error);
      setLastUpdated("Offline - Check Connection");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Run fetch on mount
  useEffect(() => {
    fetchUserData();
  }, []);

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

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#333" size={24} />
          <Text style={styles.subHeaderTitle}>My Coins</Text>
        </TouchableOpacity>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Your Coin Balance</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchUserData} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#4CAF50" />
              ) : (
                <>
                  <RotateCw size={14} color="#4CAF50" />
                  <Text style={styles.refreshText}>Refresh</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{balance}</Text>
          <Text style={styles.updateTime}>{lastUpdated}</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <ActivityRow title="Waste added to the plastic bin" date="2025-11-01" points="+15" />
        <ActivityRow title="Waste added to the organic bin" date="2025-10-24" points="+25" />
        <ActivityRow title="Waste added to the glass bin" date="2025-10-20" points="+10" />
        <ActivityRow title="Waste added to the organic bin" date="2025-10-16" points="+30" />

        <View style={styles.redeemSection}>
          <Text style={styles.redeemTitle}>Ready to redeem your coins?</Text>
          <Text style={styles.redeemSubtitle}>
            Exchange your earned EcoCoins for exciting discounts and offers at our partner shops.
          </Text>
          <TouchableOpacity style={styles.redeemButton} onPress={() => navigation.navigate('Shops')}>
            <Text style={styles.redeemButtonText}>View Redeem Shops</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.footerTab}>
          <TouchableOpacity onPress={() => navigation.navigate('Home', { userId })}>
            <Home color="#666" size={24} />
            <Text style={styles.footerText}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerTab}>
          <TouchableOpacity onPress={() => navigation.navigate('Coins', { userId })}>
            <Wallet color="#4CAF50" size={24} />
            <Text style={styles.footerText}>Coins</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerTab}>
          <TouchableOpacity onPress={() => navigation.navigate('Shops', { userId })}>
            <Store color="#666" size={24} />
            <Text style={styles.footerText}>Shops</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ActivityRow = ({ title, date, points }) => (
  <View style={styles.activityRow}>
    <CirclePlus color="#4CAF50" size={24} fill="#E8F5E9" />
    <View style={styles.activityText}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDate}>{date}</Text>
    </View>
    <Text style={styles.activityPoints}>{points}</Text>
  </View>
);

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
  logo: { width: 40, height: 40 },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerBaseText: { fontSize: 22, fontWeight: 'bold' },
  envoText: { color: 'green' },
  tixText: { color: 'black' },
  headerIcons: { flexDirection: 'row' },
  scrollContent: { padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10},
  subHeaderTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8, color: '#333'},
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 16, color: '#666', fontWeight: '500' },
  refreshButton: { flexDirection: 'row', alignItems: 'center' },
  refreshText: { color: '#4CAF50', marginLeft: 4, fontSize: 12, fontWeight: 'bold' },
  balanceAmount: { fontSize: 48, fontWeight: 'bold', color: '#4CAF50', marginVertical: 10 },
  updateTime: { fontSize: 12, color: '#999' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  activityRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 10,
    elevation: 1 
  },
  activityText: { flex: 1, marginLeft: 12 },
  activityTitle: { fontSize: 14, color: '#333', fontWeight: '500' },
  activityDate: { fontSize: 12, color: '#999', marginTop: 2 },
  activityPoints: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  redeemSection: { alignItems: 'center', marginTop: 20, paddingBottom: 30 },
  redeemTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  redeemSubtitle: { fontSize: 13, color: '#888', textAlign: 'center', marginVertical: 10, lineHeight: 18 },
  redeemButton: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: 12, 
    width: '100%' 
  },
  redeemButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
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

export default CoinsScreen;