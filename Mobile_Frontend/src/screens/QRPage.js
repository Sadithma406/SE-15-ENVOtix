import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { Home, Wallet, Store, Bell, Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function QRCodePage({navigation}) {
    // Sample QR code value - replace with actual user data
    const qrValue = 'ENVOtix-User-12345';
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#4CAF50"/>
            <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>
        
            {/* Header */}
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


            {/* Navigation Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>QR Code</Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* QR Code Card */}
                <View style={styles.qrCard}>
                    <Text style={styles.qrCardTitle}>My Enovotix QR Code</Text>
                    <Text style={styles.qrCardInstruction}>
                        Scan this code to manage your waste{'\n'}and earn coins, EcoUser!
                    </Text>

                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            value={qrValue}
                            size={220}
                            color="#000"
                            backgroundColor="#fff"
                        />
                    </View>

                    <Text style={styles.qrCardFooter}>
                        Present this code at any lane bin after{'\n'}disposing of waste
                    </Text>
                </View>

                {/* View Earned Coins Button */}
                <TouchableOpacity style={styles.coinsButton} onPress={() => navigation.navigate('Coins')}>
                    <FontAwesome5 name="store" size={18} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.coinsButtonText}>View Earned Coins</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
            {/* Bottom Navigation */}
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
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    logo: {
    width: 40,
    height: 40,
    marginRight: 10,
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
    recycleRing: {
        position: 'absolute',
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',

    },
    navBar: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        marginRight: 12,
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    qrCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    qrCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    qrCardInstruction: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    qrCodeContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 24,
    },
    qrCardFooter: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        lineHeight: 20,
    },
    coinsButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
    },
    buttonIcon: {
        marginRight: 8,
    },
    coinsButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
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

