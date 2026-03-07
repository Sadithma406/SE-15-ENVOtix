import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Home, Wallet, Store, Bell, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import API_BASE_URL from '../config/api';

export default function HomeScreen({ navigation, route }) {
  // 1. Get the userId passed from LoginScreen params
  const userId = route?.params?.userId;

  // 2. Setup state for user details
  const [userData, setUserData] = useState({
    name: "User",
    email: "...",
    contact_number: "...",
    RFID: "..."
  });
  const [loading, setLoading] = useState(true);

  // 3. Fetch real user data from backend
useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // Replace localhost with your IP if on a real phone
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        const data = await response.json();

        if (data) {
          setUserData({
            name: data.name,
            email: data.email,
            contact_number: data.contact_number, 
            RFID: data.RFID                   
          });
        }
      } catch (error) {
        console.error("Home fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" />
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>

        {/* ================= HEADER ================= */}
        <View style={styles.headerpadding}>
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
              <TouchableOpacity onPress={() => navigation.navigate('Notification',{ userId: userId })}>
                <Bell color="black" size={24} style={{ marginRight: 15 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('SideBar', { userId })}>
                <Menu color="black" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ================= BODY ================= */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerTitle}>WASTE{'\n'}MANAGEMENT</Text>
            <Text style={styles.bannerSub}>Track waste in real-time</Text>
          </View>
          <View style={styles.bannerIcon}>
            <MaterialIcons name="delete-outline" size={55} color="#000" />
          </View>
        </View>

        {/* Profile Card - Using Dynamic Database Data */}
        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color="#4CAF50" size="large" />
          ) : (
            <>
              <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                  <MaterialIcons name="person" size={30} color="#000" />
                </View>
                <View>
                  <Text style={styles.profileName}>{userData.name}</Text>
                  <Text style={styles.profileSub}>Welcome back to Envotix!</Text>
                </View>
              </View>
              <Text style={styles.info}>Contact no: {userData.contact_number}</Text>
              <Text style={styles.info}>Email: {userData.email}</Text>
              <Text style={styles.info}>Bin number: {userData.RFID}</Text>

              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => navigation.navigate('EditProfile', { userId })}
              >
                <Text style={styles.editProfileText}>Edit profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* ================= ACTION CARDS ================= */}
        <View style={styles.actionCard}>
          <TouchableOpacity onPress={() => navigation.navigate('MonitorBin', { userId })}>
            <View style={styles.actionRow}>
              <View>
                <Text style={styles.actionTitle}>Monitor My Bin</Text>
                <Text style={styles.actionSub}>Check fill level!</Text>
                <Text style={styles.actionInfo}>Last Updated: Live</Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.actionCard}>
          <TouchableOpacity onPress={() => navigation.navigate('QRPage', { userId })}>
            <View style={styles.actionRow}>
              <View>
                <Text style={styles.actionTitle}>View Smart Card</Text>
                <Text style={styles.actionSub}>Tap your card to obtain rewards</Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.actionCard}>
          <TouchableOpacity onPress={() => navigation.navigate('Coins', { userId })}>
            <View style={styles.actionRow}>
              <View>
                <Text style={styles.actionTitle}>View Coins</Text>
                <Text style={styles.actionSub}>Check the coins earned to get rewards</Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ================= FOOTER ================= */}
      <View style={styles.footer}>
        <View style={styles.footerTab}>
          <TouchableOpacity onPress={() => navigation.navigate('Home', { userId })}>
            <Home color="#4CAF50" size={24} />
            <Text style={styles.footerText}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerTab}>
          <TouchableOpacity onPress={() => navigation.navigate('Coins', { userId })}>
            <Wallet color="#666" size={24} />
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
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  logo: { width: 40, height: 40, borderRadius: 20 },
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
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerBaseText: { fontSize: 22, fontWeight: 'bold' },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  headerpadding: { padding: 20 },
  content: { paddingBottom: 20 },
  banner: {
    backgroundColor: '#CDEECD',
    margin: 15,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: { fontSize: 24, fontWeight: 'bold' },
  bannerSub: { marginTop: 5, color: '#444', fontSize: 14 },
  bannerIcon: { backgroundColor: '#A5D6A7', padding: 20, borderRadius: 12 },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    borderRadius: 14,
    padding: 15,
    elevation: 3,
  },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#CDEECD',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileName: { fontWeight: 'bold', fontSize: 16 },
  profileSub: { fontSize: 13, color: '#666' },
  info: { marginTop: 5, color: '#333', fontSize: 13 },
  editProfileButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    backgroundColor: '#6BBE45',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editProfileText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  actionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: 14,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionTitle: { fontWeight: 'bold', fontSize: 16 },
  actionSub: { fontSize: 13, color: '#666', marginTop: 2 },
  actionInfo: { fontSize: 12, color: '#999', marginTop: 4 },
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
  footerText: { fontSize: 12, marginTop: 4, color: '#666', fontWeight: '500' },
});