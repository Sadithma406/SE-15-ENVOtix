import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Register");
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ENVOtix</Text>
      <Text style={styles.subtitle}>Waste Management</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6BBE45",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
});