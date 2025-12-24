
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const CoinHeader = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('./assets/envo_logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Logo Text "ENVOtix" */}
      <Text style={styles.logoText}>
        <Text style={styles.envo}>ENVO</Text>
        <Text style={styles.tix}>tix</Text>
      </Text>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Bell Icon */}
      <Icon name="notifications-outline" size={20} color="white" />

      {/* Hamburger Menu */}
      <Icon name="menu" size={24} color="white" style={{ marginLeft: 8 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'green',
  },
  logo: {
    width: 80,
    height: 60,
  },
  logoText: {
    fontSize: 28,
    color: 'white',
  },
  envo: {
    fontWeight: 'bold',
  },
  tix: {
    fontWeight: '400',
  },
});

export default CoinHeader;
