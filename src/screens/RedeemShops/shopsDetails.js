import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChevronLeft, Bell, Menu, Lightbulb,Home, Wallet, Store } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function RedeemShopsScreen({navigation}) {
  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#4CAF50"/>
      <View style={styles.container}>
        {/* Top Bar */}
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
      

      {/* Title */}
      <View style={styles.topic}>
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
 logo: {
    width: 40,   // Adjust width as needed
    height: 40,  // Adjust height as needed
    borderRadius: 20, // Optional: makes it circular if the image is square
  },
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F5F5F5',
  },
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
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  topic: {
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

footer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
    fontWeight: '500',
  }
});
