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
  ScrollView,
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

const RedeemShopsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/whiteLogoNoBg2.png")}
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
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Bell size={24} color="black" style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SideBar")}>
            <Menu size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Back + Title */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color="#333" />
          <Text style={styles.subHeaderTitle}>Redeem Shops</Text>
        </TouchableOpacity>

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

        {/* Shop Grid */}
        <FlatList
          data={shops}
          numColumns={2}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 10 }}
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
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate("Home")}>
          <Home size={24} color="#666" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate("Coins")}>
          <Wallet size={24} color="#666" />
          <Text style={styles.footerText}>Coins</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerTab}>
          <Store size={24} color="#4CAF50" />
          <Text style={[styles.footerText, { color: "#4CAF50" }]}>Shops</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RedeemShopsScreen;
