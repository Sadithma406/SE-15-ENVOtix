import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Image
          source={require('../../assets/logoNoName.png')}
          style={styles.logo}
        />

        <Text style={styles.brandName}>
          <Text style={styles.envo}>ENVO</Text>
          <Text style={styles.tix}>tix</Text>
        </Text>

        <Text style={styles.subtitle}>WASTE MANAGEMENT</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 25,
    borderRadius: 25
  },
  brandName: {
    fontSize: 38,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 5,
  },
  envo: {
    color: "#1B3A1D",
  },
  tix: {
    color: "#1B3A1D",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B3A1D",
    letterSpacing: 3,
  },
});