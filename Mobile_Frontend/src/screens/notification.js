import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { ChevronLeft, Bell, Menu, Home, Wallet, Store, Trash2, CheckCircle, Circle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import API_BASE_URL from '../config/api';

export default function Notification({ navigation, route }) {
  // CATCH the userId passed from the previous screen 
  const userId = route?.params?.userId;

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications using the DYNAMIC userId
const fetchNotifications = async () => {
  // If userId is missing, stop the spinner immediately
  if (!userId) {
    console.log("No userId passed to this screen!");
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    
    // Fetch notifications for Laknidu
    const response = await fetch(`${API_BASE_URL}/api/notifications/${userId}`);
    
    if (!response.ok) throw new Error("Server responded with an error");

    const data = await response.json();

    // Set the data. If the array is empty, it will show "No notifications found"
    if (Array.isArray(data)) {
      setNotifications(data);
    } else {
      setNotifications([]);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    setNotifications([]);
  } finally {
    //Stop the spinner no matter what
    setLoading(false);
  }
};

  //Use useFocusEffect to refetch data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("NotificationScreen focused, userId:", userId);
      fetchNotifications();
    }, [userId])
  );

    // Delete a notification from the database and local state
  const deleteNotification = async (notifId) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${notifId}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n._id !== notifId));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>
        <View style={styles.headerpadding}>
          <View style={styles.header}>
            <Image source={require('../../assets/whiteLogoNoBg2.png')} style={styles.logo} resizeMode="contain" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerBaseText}>
                <Text style={styles.envoText}>ENVO</Text>
                <Text style={styles.tixText}>tix</Text>
              </Text>
            </View>
            <View style={styles.headerIcons}>
              <Bell color="black" size={24} style={{ marginRight: 15 }} />
              <TouchableOpacity onPress={() => navigation.navigate('SideBar', { userId })}>
                <Menu color="black" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.pageTitleRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ChevronLeft color="#333" size={24} />
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>Notifications</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            {loading ? (
              <ActivityIndicator color="#4CAF50" size="large" />
            ) : notifications.length > 0 ? (
              notifications.map((item, index) => (
                <View key={item._id}>
                  <View style={styles.item}>
                    {item.status === 'unread' ? (
                      <Circle size={20} color="#4CAF50" fill="#4CAF50" />
                    ) : (
                      <CheckCircle size={20} color="#4CAF50" />
                    )}
                    
                    <View style={styles.itemText}>
                      <Text style={[styles.itemTitle, item.status === 'unread' && {fontWeight: 'bold'}]}>
                        {item.title}: {item.message}
                      </Text>
                      <Text style={styles.itemDate}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteNotification(item._id)}>
                      <Trash2 size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                  {index < notifications.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: '#777' }}>No notifications found.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* FOOTER - Pass the userId to maintain the session when navigating */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Home', { userId })}>
          <Home color="#666" size={24} />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Coins', { userId })}>
          <Wallet color="#666" size={24} />
          <Text style={styles.footerText}>Coins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={() => navigation.navigate('Shops', { userId })}>
          <Store color="#666" size={24} />
          <Text style={styles.footerText}>Shops</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
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
  logo: { width: 40, height: 40 },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  headerpadding: { padding: 20 },
  content: { flex: 1, padding: 16 },
  subHeaderTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8, color: '#333'},
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#000' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  itemText: { flex: 1, marginLeft: 10 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#000' },
  itemDate: { fontSize: 12, color: '#777', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#EEE' },
  footer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  footerTab: { alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 12, marginTop: 4, color: '#666', fontWeight: '500' },
});