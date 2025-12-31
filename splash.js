import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace("Register");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/envotix-logo.png")}
        style={styles.logo}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.envo}>ENVO</Text>
        <Text style={styles.tix}>tix</Text>
      </View>

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
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#000",
    marginTop: 10,
  },
});
