import React from 'react';
import { View, Text, StyleSheet,Image, Touchable, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Home, Trash2, QrCode, Coins, Tag, Bell, User,Menu } from 'lucide-react-native';

const CustomDrawer = ({navigation}) => {
  // List of items to display in the menu
  const menuItems = [
    { label: 'Home', icon: Home, screen: 'Home' },
    { label: 'Monitor Bin', icon: Trash2, screen: 'MonitorBin' },
    { label: 'QR Code', icon: QrCode, screen: 'QRPage' },
    { label: 'Coins Earned', icon: Coins, screen: 'Coins' },
    { label: 'Redeem Shops', icon: Tag, screen: 'Shops' },
    { label: 'Notifications', icon: Bell, screen: 'Notification' },
    { label: 'View Profile', icon: User, screen: 'EditProfile' },
  ];

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.headerPadding}>
    {/* 1. Header Section */}
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
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Bell color="black" size={24} style={{ marginRight: 15 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Menu color="white" size={24} />
        </TouchableOpacity>
        </View>
      </View>
</View>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuItem}>
          <TouchableOpacity style={styles.menuItem} key={index} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.menuText}>{item.label}</Text>
            <item.icon color="white" size={24} />
          </TouchableOpacity>  
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
  headerPadding:{paddingTop:20},
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
    marginBottom: 17 // Vertical gap between items
  },
  menuText: { 
    padding:0,
    color: 'white', 
    fontSize: 18, 
    fontWeight: '500', 
    marginRight: 15 // Space between text and icon
  },
});

export default CustomDrawer;