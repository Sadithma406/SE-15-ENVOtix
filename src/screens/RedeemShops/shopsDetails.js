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
import { Home, Wallet, Store, Bell, Menu } from 'lucide-react-native';

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
      <View style={styles.footer}>
        <View style={styles.footerTab}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Home color="#666" size={24} />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.footerTab}>
          <TouchableOpacity onPress={() => navigation.navigate('Coins')}>
            <Wallet color="#666" size={24} />
            <Text style={styles.footerText}>Coins</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerTab}>
          <TouchableOpacity onPress={() => navigation.navigate('Shops')}>
            <Store color="#666" size={24} />
            <Text style={styles.footerText}>Shops</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  appName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
  },

  categories: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eaeaea",
    borderRadius: 20,
    marginRight: 8,
  },

  categoryActive: {
    backgroundColor: "#2ecc71",
  },

  categoryText: {
    fontSize: 12,
    color: "#555",
  },

  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    flex: 1,
    elevation: 2,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: 110,
  },

  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  tag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#000000aa",
    paddingHorizontal: 6,
    borderRadius: 10,
  },

  tagText: {
    color: "#fff",
    fontSize: 10,
  },

  coins: {
    textAlign: "center",
    padding: 10,
    fontSize: 12,
    color: "#333",
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
