import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Home, Wallet, Store, Bell, Menu } from 'lucide-react-native';


export default function RedeemOfferDetails() {
  return (
    <View style={styles.container}>
      {/* Top Green Header */}
      <View style={styles.topBar}>
        <Ionicons name="leaf-outline" size={20} color="#fff" />
        <Text style={styles.appName}>ENVOTix</Text>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
      </View>

      {/* Back + Title */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={22} color="#000" />
        <Text style={styles.headerTitle}>Redeem Offer Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cafe Image */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
          }}
          style={styles.image}
        />

        {/* Offer Details */}
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
            <Text style={styles.infoText}>
              Valid until 31 December 2025
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#2ecc71" />
            <Text style={styles.infoText}>Only on Wednesday</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.aboutTitle}>About This Offer</Text>
          <Text style={styles.aboutText}>
            Enjoy a delightful 20% discount on all beverages and pastries at
            Chinese Dragon Cafe. Perfect for a refreshing break or a quick bite.
            This offer is exclusive to our loyalty program members and can be
            redeemed once per visit.
          </Text>
          <Text style={styles.terms}>Terms and conditions apply.</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={22} color="#777" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={22} color="#777" />
          <Text style={styles.navText}>Offers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemActive}>
          <Ionicons name="cart" size={22} color="#2ecc71" />
          <Text style={styles.navTextActive}>Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  topBar: {
    height: 55,
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },

  appName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
  },

  headerTitle: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
  },

  image: {
    width: "100%",
    height: 210,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
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
    backgroundColor: "#2ecc71",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  discountText: {
    color: "#fff",
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

  aboutTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
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

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navItemActive: {
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderTopColor: "#2ecc71",
  },

  navText: {
    fontSize: 12,
    color: "#777",
  },

  navTextActive: {
    fontSize: 12,
    color: "#2ecc71",
    fontWeight: "600",
  },
});
