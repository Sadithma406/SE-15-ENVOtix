import React from 'react';
import { View, Text, StyleSheet,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Home, Trash2, QrCode, Coins, Tag, Bell, User,Menu } from 'lucide-react-native';

const CustomDrawer = () => {
  // List of items to display in the menu
  const menuItems = [
    { label: 'Home', icon: Home },
    { label: 'Monitor Bin', icon: Trash2 },
    { label: 'QR Code', icon: QrCode },
    { label: 'Coins Earned', icon: Coins },
    { label: 'Redeem Shops', icon: Tag },
    { label: 'Notifications', icon: Bell },
    { label: 'View Profile', icon: User },
  ];

  return (
    <SafeAreaView style={styles.container}>
    {/* 1. Header Section */}
      <View style={styles.header}>
        <Image 
    source={require('../../images/whiteLogoNoBg2.png')} 
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
          <Bell color="black" size={24} style={{ marginRight: 15 }} />
          <Menu color="white" size={24} />
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuItem}>
            {/* The Text comes first because it is on the left of the icon */}
            <Text style={styles.menuText}>{item.label}</Text>
            {/* The Icon is on the far right */}
            <item.icon color="white" size={24} />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 40,
    paddingVertical: -10, 
    alignItems: 'center',
    marginTop: -20, 
    marginHorizontal: -20,
    paddingTop: 20,
  },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },   
  container: { 
    flex: 1, 
    backgroundColor: '#4CAF50' // The theme green color
  },
  menuContainer: { 
    marginTop: 60, // Space from the top of the screen
    paddingRight: 25 // Space from the right edge
  },
  menuItem: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', // Pushes content to the right
    alignItems: 'center', 
    marginBottom: 35 // Vertical gap between items
  },
  menuText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '500', 
    marginRight: 15 // Space between text and icon
  },
});

export default CustomDrawer;