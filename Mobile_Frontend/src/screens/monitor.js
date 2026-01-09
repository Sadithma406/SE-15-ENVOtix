import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Platform,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { ChevronLeft, Bell, Menu, ChevronRight, Home, Wallet, Store } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MonitorScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#4CAF50" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                style={{ backgroundColor: '#F5F5F5' }}
            >
                {/* ================= HEADER ================= */}
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

                {/* ================= SUB HEADER ================= */}
                <View style={styles.subHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft color="#333" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle}>Monitor My Bin</Text>
                </View>

                {/* ================= WASTE CARDS ================= */}
                {/* Organic Waste Card */}
                <TouchableOpacity
                    style={styles.wasteCard}
                    onPress={() => navigation.navigate('Organic')}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeft}>
                            <Image
                                source={require('../../assets/organic.png')}
                                style={styles.wasteIcon}
                                resizeMode="contain"
                            />
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.wasteType}>Organic Waste</Text>
                                <Text style={styles.fillPercentage}>75% Full</Text>
                                <Text style={styles.lastUpdated}>Last Updated: 5 mins ago</Text>
                            </View>
                        </View>
                        <ChevronRight color="#666" size={24} />
                    </View>
                </TouchableOpacity>

                {/* Plastic Waste Card */}
                <TouchableOpacity
                    style={styles.wasteCard}
                    onPress={() => navigation.navigate('Plastic')}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeft}>
                            <Image
                                source={require('../../assets/plastic.png')}
                                style={styles.wasteIcon}
                                resizeMode="contain"
                            />
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.wasteType}>Plastic Waste</Text>
                                <Text style={styles.fillPercentage}>40% Full</Text>
                                <Text style={styles.lastUpdated}>Last Updated: 1 hour ago</Text>
                            </View>
                        </View>
                        <ChevronRight color="#666" size={24} />
                    </View>
                </TouchableOpacity>

                {/* Glass Waste Card */}
                <TouchableOpacity
                    style={styles.wasteCard}
                    onPress={() => navigation.navigate('Glass')}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeft}>
                            <Image
                                source={require('../../assets/glass.png')}
                                style={styles.wasteIcon}
                                resizeMode="contain"
                            />
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.wasteType}>Glass Waste</Text>
                                <Text style={styles.fillPercentage}>90% Full</Text>
                                <Text style={styles.lastUpdated}>Last Updated: 30 mins ago</Text>
                            </View>
                        </View>
                        <ChevronRight color="#666" size={24} />
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* ================= FOOTER ================= */}
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
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 20,
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
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
    headerIcons: {
        flexDirection: 'row',
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    subHeaderTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
    wasteCard: {
        backgroundColor: '#E8E8E8',
        borderRadius: 12,
        marginBottom: 15,
        padding: 18,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    wasteIcon: {
        width: 35,
        height: 35,
        marginRight: 12,
    },
    cardTextContainer: {
        flex: 1,
    },
    wasteType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    fillPercentage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    lastUpdated: {
        fontSize: 13,
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
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
    },
    footerTextActive: {
        color: '#4CAF50',
    },
});

