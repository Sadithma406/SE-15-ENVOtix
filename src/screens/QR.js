import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar as RNStatusBar,
    Platform,
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
        <View style={styles.container}>
            <RNStatusBar barStyle="light-content" backgroundColor="#4CAF50" translucent={false} />

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
                <TouchableOpacity style={styles.backButton}>
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
                <TouchableOpacity style={styles.coinsButton}>
                    <FontAwesome5 name="store" size={18} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.coinsButtonText}>View Earned Coins</Text>
                </TouchableOpacity>
            </View>

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
        </View>
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
headerTextContainer: {
    flex: 1,
},
    header: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 14,
        paddingTop: 0,
        minHeight: 60,
        width: '100%',
        zIndex: 10,

    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },
    logoContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 10,
    },
    recycleRing: {
        position: 'absolute',
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,



    },
    headerTitleENVO: {
        color: '#1B5E20', // Dark green
    },
    headerTitleTix: {
        color: '#000', // Black
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
        flex: 1,
    },
    iconButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
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
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
},
footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},
footerText: {
    fontSize: 12,
    color: '#666',
},
});

