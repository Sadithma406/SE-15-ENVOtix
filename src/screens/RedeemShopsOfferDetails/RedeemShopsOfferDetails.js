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
