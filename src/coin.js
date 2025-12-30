import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image, // Added Image import
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Bell, 
  Menu, 
  CirclePlus, 
  Home, 
  Wallet, // Changed to match your footer usage
  Store,  // Changed to match your footer usage
  RotateCw
} from 'lucide-react-native';

const CoinsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Ensures the top system bar is the same green as the header */}
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      {/* 1. Header Section */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/whiteLogoNoBg2.png')} // Verify this folder name (assets vs images)
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
          <Bell color="white" size={24} style={{ marginRight: 15 }} />
          <Menu color="white" size={24} />
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft color="#333" size={24} />
          <Text style={styles.subHeaderTitle}>My Coins</Text>
        </TouchableOpacity>

        <View style={styles.balanceCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Your Coin Balance</Text>
            <TouchableOpacity style={styles.refreshButton}>
               <RotateCw size={14} color="#4CAF50" />
               <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>140</Text>
          <Text style={styles.updateTime}>Last updated: Yesterday, 3:45 PM</Text>
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
          <TouchableOpacity style={styles.redeemButton}>
            <Text style={styles.redeemButtonText}>View Redeem Shops</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab}>
          <Home color="#666" size={24} />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab}>
          <Wallet color="#4CAF50" size={24} />
          <Text style={[styles.footerText, {color: '#4CAF50'}]}>Coins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab}>
          <Store color="#666" size={24} />
          <Text style={styles.footerText}>Shops</Text>
        </TouchableOpacity>
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
  safeArea: { 
    flex: 1, 
    backgroundColor: '#4CAF50' // Keep this green so the status bar matches header
  },

  header: { 
    backgroundColor: '#4CAF50', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 12, 
    alignItems: 'center',
  },
  
  logo: { width: 40, height: 40 },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerBaseText: { fontSize: 22, fontWeight: 'bold' },
  envoText: { color: 'white' }, // ENVO looks better in white on green bg
  tixText: { color: 'black' },
  headerIcons: { flexDirection: 'row' },

  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContent: { padding: 20 },
  
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  subHeaderTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8, color: '#333' },

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