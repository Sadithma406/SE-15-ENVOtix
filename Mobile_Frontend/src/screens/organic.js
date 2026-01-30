import React, { useState, useEffect} from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView,
  Image,
  Platform, 
  StatusBar, 
  TouchableOpacity
} from 'react-native';
import { ChevronLeft, Bell, Menu, Lightbulb,Home, Wallet, Store } from 'lucide-react-native';
import CircularGauge from '../components/CircularGauge';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrganicBinScreen = ({navigation}) => {
  // IoT PLACEHOLDER: This value will eventually come from your Node.js backend
  const [fillLevel,setFillLevel] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchBinData = async () => {
      try {
        // Replace with your laptop's IP address if testing on a real phone
        const response = await fetch('http://localhost:8082/api/bins/B21938cis9');
        const data = await response.json();
        
        if (data && data.organic) {
          setFillLevel(data.organic.fill_level); // Set the gauge value
          setLastUpdated(`Last updated: ${new Date(data.organic.last_updated).toLocaleTimeString()}`);
        }
      } catch (error) {
        console.error("Error fetching bin data:", error);
        setLastUpdated("Offline - Check Connection");
      }
    };

    fetchBinData()
    const interval = setInterval(fetchBinData, 30000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <SafeAreaView style={styles.safeArea}>
    <StatusBar backgroundColor="#4CAF50"/>
    <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>

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
        <TouchableOpacity onPress={() => navigation.navigate('SideBar')}>
          <Menu color="black" size={24} />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.subHeader}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <ChevronLeft color="#333" size={24} />
      </TouchableOpacity>
      <Text style={styles.subHeaderTitle}>Organic Bin</Text>
    </View>
    <View style={styles.iconTitleSection}>
      <Image
            source={require('../../assets/organic.png')} // Make sure this filename matches your asset
            style={styles.recycleImage} 
            resizeMode="contain"
          />
          <Text style={styles.iconSectionText}>Organic Bin</Text>
        </View> 


        {/* 2. Main Gauge Card */}
        <View style={styles.mainCard}>
           <View style={styles.gaugeContainer}>
              <CircularGauge percentage={fillLevel} />
           </View>
           <Text style={styles.updateText}> {lastUpdated || 'fetching data...'}</Text>
        </View>

        {/* 3. Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Lightbulb color="#4CAF50" size={20} />
            <Text style={styles.tipsTitle}>Organic Waste Tips</Text>
          </View>
           <Text style={styles.tipItem}>• Composting organic waste reduces landfill usage and enriches soil naturally.</Text>
                    <Text style={styles.tipItem}>• Avoid throwing food waste in public places or water sources.</Text>
                    <Text style={styles.tipItem}>• Improper disposal of organic waste attracts pests and spreads diseases.</Text>
                    <Text style={styles.tipItem}>• Composting organic waste turns leftovers into nutrient-rich soil.</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
              <View style={styles.footerTab}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Home color="#666" size={24} />
                <Text style={styles.footerText}>Home</Text>
              </TouchableOpacity>
              </View>
              <View style={styles.footerTab}>
                <TouchableOpacity onPress={() => navigation.navigate('Coins')}>
                  <Wallet color="#666" size={24} />
                  <Text style={styles.footerText}>Coins</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.footerTab}>
                <TouchableOpacity onPress={() => navigation.navigate('Shops')}>
                  <Store color="#666" size={24} />
                  <Text style={styles.footerText}>Shops</Text>
                </TouchableOpacity>
              </View>
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
    paddingHorizontal: 20,
    paddingVertical: 9, 
    alignItems: 'center',
    marginTop: -20, 
    marginHorizontal: -20,
    paddingTop: 20,
  },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  subHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25,
    marginTop: 20
  },
  subHeaderTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 10, 
    color: '#333' 
  },
  recycleImage: {
  width: 35,
  height: 35,
  marginRight: 12,
},
iconTitleSection: { 
  flexDirection: 'row', 
  alignItems: 'center', 
  marginBottom: 10,
  paddingVertical: 5,
},
iconSectionText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  scrollContent: { padding: 20 },
  screenTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#000' },
 // In plastic.js - Update these styles
mainCard: { 
  backgroundColor: 'white', 
  borderRadius: 25, 
  paddingTop: 20,
  paddingBottom: 30, // Added padding at the bottom to push text away
  alignItems: 'center',
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  marginHorizontal: 5,
},
gaugeContainer: { 
  height: 230, // Fixed height for the gauge area
  justifyContent: 'center', 
  alignItems: 'center',
  marginBottom: 40, // Creates space before "Last updated"
},
updateText: { 
  color: '#666', 
  fontSize: 14,
  fontWeight: '500',
  textAlign: 'center', // Ensures it stays centered
},
  tipsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 50 },
  tipsTitle: { marginLeft: 10, fontWeight: 'bold', fontSize: 16, color: '#333' },
  tipItem: { color: '#555', marginBottom: 10, lineHeight: 22, fontSize: 14 },
  footer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Adjusts for iPhone notch
  },
  footerTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
    fontWeight: '500',
  }
});

export default OrganicBinScreen;