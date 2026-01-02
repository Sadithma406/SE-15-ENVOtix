// RedeemOfferDetails.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  ChevronLeft,
  Bell,
  Menu,
  Home,
  Wallet,
  Store,
} from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RedeemOfferDetails({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: "#F5F5F5" }}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/whiteLogoNoBg2.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.headerTextContainer}>
            <Text>
              <Text style={styles.envoText}>ENVO</Text>
              <Text style={styles.tixText}>tix</Text>
            </Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
              <Bell color="black" size={24} style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SideBar")}>
              <Menu color="black" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Page Title Row */}
          <View style={styles.pageTitleRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Redeem Offer Details</Text>
          </View>

          {/* Image */}
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
            }}
            style={styles.image}
          />

          {/* Offer Card */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>Chinese Dragon Cafe</Text>
              <View style={styles.discount}>
                <Text style={styles.discountText}>20% OFF</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.infoText}>Redeem for 100 Coins</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color="#4CAF50" />
              <Text style={styles.infoText}>Valid until 31 Dec 2025</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color="#4CAF50" />
              <Text style={styles.infoText}>Only on Wednesday</Text>
            </View>
          </View>

          {/* About Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>About This Offer</Text>
            <Text style={styles.aboutText}>
              Enjoy a delightful 20% discount on all beverages and pastries at
              Chinese Dragon Cafe. This offer is exclusive to loyalty members.
            </Text>
            <Text style={styles.terms}>Terms and conditions apply.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate("Home")}>
          <Home size={24} color="#666" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate("Coins")}>
          <Wallet size={24} color="#666" />
          <Text style={styles.footerText}>Coins</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate("Shops")}>
          <Store size={24} color="#4CAF50" />
          <Text style={[styles.footerText, { color: "#4CAF50" }]}>Shops</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 9,
    alignItems: "center",
    marginTop: -20,
    marginHorizontal: -20,
    paddingTop: 20,
  },

  logo: {
    width: 40,
    height: 40,
  },

  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },

  envoText: {
    color: "green",
    fontSize: 22,
    fontWeight: "bold",
  },

  tixText: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
  },

  headerIcons: {
    flexDirection: "row",
  },

  content: {
    padding: 16,
  },

  pageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },

  image: {
    width: "100%",
    height: 210,
    borderRadius: 12,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  discount: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  discountText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  aboutText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  terms: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },

  footer: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },

  footerTab: {
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
    fontWeight: "500",
  },
});
