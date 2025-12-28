import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";

const categories = ["All Shops", "Dining", "Fashion", "Beauty", "Grocery"];

const shops = [
  {
    id: "1",
    name: "Pizza Hut",
    discount: "10%",
    coins: "80 coins",
    tag: "Dining",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Keells",
    discount: "15%",
    coins: "150 coins",
    tag: "Grocery",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Looks",
    discount: "10%",
    coins: "80 coins",
    tag: "Beauty",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    name: "KFC",
    discount: "20%",
    coins: "100 coins",
    tag: "Dining",
    image: "https://via.placeholder.com/150",
  },
];

export default function RedeemShopsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Redeem Shops</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search shops..."
        style={styles.searchBar}
      />

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity key={index} style={styles.categoryChip}>
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Shop Grid */}
      <FlatList
        data={shops}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>

            <Text style={styles.discount}>{item.discount}</Text>
            <Text style={styles.coins}>{item.coins}</Text>
          </View>
        )}
      />
    </View>
  );
}
