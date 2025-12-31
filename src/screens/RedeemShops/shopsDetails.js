import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = ["All Shops", "Dining", "Fashion", "Beauty"];

const shops = [
  { id: "1", title: "Cafe", discount: "10%", coins: "80 coins", tag: "Dining" },
  { id: "2", title: "Meals", discount: "15%", coins: "90 coins", tag: "Grocery" },
  { id: "3", title: "LOOKS", discount: "10%", coins: "80 coins", tag: "Beauty" },
  { id: "4", title: "Food", discount: "20%", coins: "100 coins", tag: "Dining" },
  { id: "5", title: "Style", discount: "15%", coins: "90 coins", tag: "Fashion" },
  { id: "6", title: "Wear", discount: "20%", coins: "120 coins", tag: "Fashion" },
  { id: "7", title: "Kids", discount: "10%", coins: "150 coins", tag: "Toys" },
  { id: "8", title: "Fruits", discount: "15%", coins: "150 coins", tag: "Grocery" },
  { id: "9", title: "Burger", discount: "25%", coins: "150 coins", tag: "Grocery" },
  { id: "10", title: "LIYO", discount: "20%", coins: "80 coins", tag: "Beauty" },
];

export default function RedeemShopsScreen() {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Ionicons name="leaf-outline" size={20} color="#fff" />
        <Text style={styles.appName}>ENVOTix</Text>
        <Ionicons name="menu" size={22} color="#fff" />
      </View>

      {/* Title */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={22} />
        <Text style={styles.headerTitle}>Redeem Shops</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#777" />
        <TextInput placeholder="Search shops..." style={styles.searchInput} />
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryChip,
              index === 0 && styles.categoryActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                index === 0 && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
            </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <FlatList
        data={shops}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
              }}
              style={styles.cardImage}
            />

            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>

            <Text style={styles.coins}>{item.coins}</Text>
          </View>
        )}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="home-outline" size={22} color="#777" />
          <Text style={styles.navText}>Home</Text>
        </View>

        <View style={styles.navItem}>
          <Ionicons name="grid-outline" size={22} color="#777" />
          <Text style={styles.navText}>Offers</Text>
        </View>

        <View style={styles.navItemActive}>
          <Ionicons name="cart" size={22} color="#2ecc71" />
          <Text style={styles.navTextActive}>Shop</Text>
        </View>
      </View>
    </View>
  );
}
