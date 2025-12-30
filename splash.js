import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // change if needed
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#6BBE45", "#3A7D2C"]} // gradient colors
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* LOGO */}
      <Image
        source={require("./assets/envotix-logo.png")}
        style={styles.logo}
      />

      {/* APP NAME */}
      <View style={styles.titleContainer}>
        <Text style={styles.envo}>ENVO</Text>
        <Text style={styles.tix}>tix</Text>
      </View>

      {/* TAGLINE */}
      <Text style={styles.subtitle}>Waste Management</Text>
    </LinearGradient>
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
    width: 150,
    height: 150,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#000",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
    envo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
    tix: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 7,
  },

  subtitle: {
    fontSize: 20,
    color: "#000000ff",
    marginTop: 10,
  },
});
