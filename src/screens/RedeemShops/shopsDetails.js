import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
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

const categories = ["All Shops", "Dining", "Fashion", "Beauty"];

const shops = [
  { id: "1", discount: "10%", coins: "80 coins", tag: "Dining" },
  { id: "2", discount: "15%", coins: "90 coins", tag: "Grocery" },
  { id: "3", discount: "10%", coins: "80 coins", tag: "Beauty" },
  { id: "4", discount: "20%", coins: "100 coins", tag: "Dining" },
  { id: "5", discount: "15%", coins: "90 coins", tag: "Fashion" },
  { id: "6", discount: "20%", coins: "120 coins", tag: "Fashion" },
];

export default function RedeemShopsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      <View style={{ flex: 1 }}>
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
              <Bell size={24} color="black" style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SideBar")}>
              <Menu size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Page Title */}
          <View style={styles.pageTitleRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Redeem Shops</Text>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#777" />
            <TextInput
              placeholder="Search shops..."
              style={styles.searchInput}
            />
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
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
        </View>

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
            <Text style={[styles.footerText, { color: "#4CAF50" }]}>
              Shops
            </Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
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

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
  },

  categories: {
    flexDirection: "row",
    marginBottom: 12,
  },

  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EEE",
    borderRadius: 20,
    marginRight: 8,
  },

  categoryActive: {
    backgroundColor: "#4CAF50",
  },

  categoryText: {
    fontSize: 12,
    color: "#555",
  },

  categoryTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
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
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  discountText: {
    color: "#FFF",
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
    color: "#FFF",
    fontSize: 10,
  },

  coins: {
    textAlign: "center",
    padding: 10,
    fontSize: 12,
    color: "#333",
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

