import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar as RNStatusBar,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodePage() {
    // Sample QR code value - replace with actual user data
    const qrValue = 'ENVOtix-User-12345';
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <RNStatusBar barStyle="light-content" backgroundColor="#4CAF50" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 8 : 0) }]}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="bulb" size={20} color="#fff" />
                        <View style={styles.recycleRing}>
                            <Ionicons name="reload" size={18} color="#fff" />
                        </View>
                    </View>
                </View>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>
                        <Text style={styles.headerTitleENVO}>ENVO</Text>
                        <Text style={styles.headerTitleTix}>tix</Text>
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="menu" size={24} color="#fff" />
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
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={26} color="#4CAF50" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <FontAwesome5 name="wallet" size={24} color="#000" />
                    <Text style={styles.navLabel}>Coins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <FontAwesome5 name="store" size={24} color="#000" />
                    <Text style={styles.navLabel}>Shops</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    bottomNav: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 8 : 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    navItem: {
        alignItems: 'center',
        flex: 1,
    },
    navLabel: {
        fontSize: 12,
        color: '#000',
        marginTop: 4,
    },
    navLabelActive: {
        color: '#4CAF50',
        fontWeight: '600',
    },
});

