import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Trash2, CreditCard, Coins, Tag, Bell, User, Menu } from 'lucide-react-native';

const CustomDrawer = ({ navigation, route }) => {
  // 1. Catch the userId passed from the previous screen
  const userId = route?.params?.userId;

  // 2. Define menu items
  const menuItems = [
    { label: 'Home', icon: Home, screen: 'Home' },
    { label: 'Monitor Bin', icon: Trash2, screen: 'MonitorBin' },
    { label: 'Smart Card', icon: CreditCard, screen: 'QRPage' },
    { label: 'Coins Earned', icon: Coins, screen: 'Coins' },
    { label: 'Redeem Shops', icon: Tag, screen: 'Shops' },
    { label: 'Notifications', icon: Bell, screen: 'Notification' },
    { label: 'View Profile', icon: User, screen: 'EditProfile' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <View style={styles.headerPadding}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/whiteLogoNoBg2.png')} 
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
            {/* Pass userId to Notifications */}
            <TouchableOpacity onPress={() => navigation.navigate('Notification', { userId})}>
              <Bell color="black" size={24} style={{ marginRight: 15 }} />
            </TouchableOpacity>
            {/* Back to the previous screen */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Menu color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem} 
            // Pass the userId to every screen in the menu
            onPress={() => navigation.navigate(item.screen, { userId })}
          >
            <Text style={styles.menuText}>{item.label}</Text>
            <item.icon color="white" size={24} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4CAF50' },
  headerPadding: { paddingTop: 20 },
  header: { 
    backgroundColor: '#4CAF50', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: -20, 
    marginHorizontal: -20,
    paddingTop: 20,
    height: 60,
  },
  logo: { width: 40, height: 40, borderRadius: 20 },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  menuContainer: { marginTop: 60, paddingRight: 25 },
  menuItem: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginBottom: 25 
  },
  menuText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '500', 
    marginRight: 15 
  },
});

export default CustomDrawer;