import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView,
  Image,
  Platform, 
  StatusBar 
} from 'react-native';
import { ChevronLeft, Bell, Menu, Lightbulb } from 'lucide-react-native';
import CircularGauge from '../components/CircularGauge';
import { SafeAreaView } from 'react-native-safe-area-context';

const PlasticBinScreen = () => {
  // IoT PLACEHOLDER: This value will eventually come from your Node.js backend
  const [fillLevel] = useState(84); 

  return (
    <SafeAreaView style={styles.safeArea}>
    <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
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
          <Bell color="black" size={24} style={{ marginRight: 15 }} />
          <Menu color="black" size={24} />
        </View>
      </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.subHeader}>
            <ChevronLeft color="#333" size={24} />
            <Text style={styles.subHeaderTitle}>Plastic Bin</Text>
        </View>
        <View style={styles.iconTitleSection}>
          <Image 
            source={require('../../assets/plastic.png')} // Make sure this filename matches your asset
            style={styles.recycleImage} 
            resizeMode="contain"
          />
          <Text style={styles.iconSectionText}>Plastic Bin</Text>
        </View> 


        {/* 2. Main Gauge Card */}
        <View style={styles.mainCard}>
           <View style={styles.gaugeContainer}>
              <CircularGauge percentage={fillLevel} />
           </View>
           <Text style={styles.updateText}>Last updated: 1 hour ago</Text>
        </View>

        {/* 3. Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Lightbulb color="#4CAF50" size={20} />
            <Text style={styles.tipsTitle}>Plastic Recycling Tips</Text>
          </View>
          <Text style={styles.tipItem}>• Rinse plastic containers before recycling to avoid contamination.</Text>
          <Text style={styles.tipItem}>• Check the recycling symbols (1-7) on plastic items to ensure they are accepted.</Text>
          <Text style={styles.tipItem}>• Many plastic bags cannot be recycled with other plastics; look for special drop-offs.</Text>
        </View>
      </ScrollView>
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
    paddingVertical: 15, 
    alignItems: 'center' 
  },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  subHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25 
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
});

export default PlasticBinScreen;