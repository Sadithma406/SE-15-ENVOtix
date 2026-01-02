import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Home, Wallet, Store, Bell, Menu } from 'lucide-react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function RedeemOfferDetails({ navigation }) {
  return (
     <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#4CAF50"/>
        <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>
    
      {/* 1. Main Green Header */}
      <View style={styles.header}>
        <Image 
          source={require('../../../assets/whiteLogoNoBg2.png')} 
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
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Bell color="black" size={24} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SideBar')}>
            <Menu color="black" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. White Topic Bar with Working Back Button */}
      <View style={styles.topic}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>Redeem Offer Details</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Scrollable Content */}
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1528605248644-14dd04022da1" }}
          style={styles.image}
        />

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>Chinese Dragon Cafe</Text>
            <View style={styles.discount}>
              <Text style={styles.discountText}>20% OFF</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle" size={18} color="#2ecc71" />
            <Text style={styles.infoText}>Redeem for 100 Coins</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#2ecc71" />
            <Text style={styles.infoText}>Valid until 31 Dec 2025</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#2ecc71" />
            <Text style={styles.infoText}>Only on Wednesday</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.aboutTitle}>About This Offer</Text>
          <Text style={styles.aboutText}>
            Enjoy a delightful 20% discount on all beverages and pastries at
            Chinese Dragon Cafe. This offer is exclusive to our loyalty program members.
          </Text>
          <Text style={styles.terms}>Terms and conditions apply.</Text>
        </View>
      </ScrollView>

      {/* 4. Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Organic')}>
          <Home color="#666" size={24} />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Coins')}>
          <Wallet color="#666" size={24} />
          <Text style={styles.footerText}>Coins</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Shops')}>
          <Store color="#4CAF50" size={24} />
          <Text style={[styles.footerText, {color: '#4CAF50'}]}>Shops</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   logo: {
    width: 40,   // Adjust width as needed
    height: 40,  // Adjust height as needed
    borderRadius: 20, // Optional: makes it circular if the image is square
  },
  header: { 
    backgroundColor: '#4CAF50', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 30,
    paddingVertical: 9, 
    alignItems: 'center',
    marginTop: -20, 
    marginHorizontal: -20,
    paddingTop: 20,
  },
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F5F5F5',
  },
  headerTextContainer: { flex: 1, marginLeft: 10 },
  headerBaseText: { fontSize: 22, fontWeight: 'bold' },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  topic: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  image: { width: "100%", height: 210 },
  card: { backgroundColor: "#fff", margin: 16, borderRadius: 12, padding: 16, elevation: 2 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700" },
  discount: { backgroundColor: "#2ecc71", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  infoText: { marginLeft: 8, fontSize: 14, color: "#333" },
  aboutTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  aboutText: { fontSize: 14, color: "#555", lineHeight: 20 },
  terms: { marginTop: 8, fontSize: 12, color: "#888" },
  footer: { 
    flexDirection: 'row', 
    height: 70, 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },
  footerTab: { alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 12, marginTop: 4, color: '#666', fontWeight: '500' }
});