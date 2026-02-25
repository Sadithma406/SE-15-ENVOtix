import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Wallet, Store, Bell, Menu } from 'lucide-react-native';

export default function EditProfileScreen({ navigation, route }) {
  // 1. Catch the userId passed from the SideBar or Home
  const userId = route?.params?.userId;

  // Form State
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState(''); // NEW: Official name for display labels
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Status Message State
  const [statusMsg, setStatusMsg] = useState({ text: '', color: '#666' });

  // 2. Fetch current user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setStatusMsg({ text: 'User session lost.', color: 'red' });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await response.json();

        if (data) {
          setName(data.name || '');
          setDisplayName(data.name || ''); // Initialize labels with saved DB name
          setEmail(data.email || '');
          setContact(data.contact_number || ''); // Maps to DB key 'contact_number'
          setAddress(data.address || '');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setStatusMsg({ text: 'Failed to load profile.', color: 'red' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // 3. Update database function
  const handleSaveChanges = async () => {
    setStatusMsg({ text: 'Saving...', color: '#4CAF50' });
    try {
      const response = await fetch(`http://localhost:5000/api/users/update/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          name: name,
          email: email,
          contact_number: contact, 
          address: address
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setDisplayName(name); // NEW: Update display labels ONLY after successful save
        setStatusMsg({ text: 'Update Successful!', color: '#4CAF50' });
        // Refresh Home page data after 1 second
        setTimeout(() => navigation.navigate("Home", { userId }), 1000);
      } else {
        setStatusMsg({ text: result.message || 'Update failed.', color: 'red' });
      }
    } catch (error) {
      console.error("Network Error:", error);
      setStatusMsg({ text: 'Connection failed. Check server.', color: 'red' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>
        
        <View style={styles.header}>
          <Image source={require('../../assets/whiteLogoNoBg2.png')} style={styles.logo} resizeMode="contain" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerBaseText}>
              <Text style={styles.envoText}>ENVO</Text>
              <Text style={styles.tixText}>tix</Text>
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Notification', { userId })}>
              <Bell color="black" size={24} style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SideBar', { userId })}>
              <Menu color="black" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.profileSection}>
              {/* Uses displayName so it doesn't change instantly while typing */}
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.lastVisit}>{displayName}'s Profile</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.field}>
              <Text style={styles.label}>Your Name</Text>
              <View style={styles.inputRow}>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
                <MaterialIcons name="edit" size={20} color="#666" />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Your Email</Text>
              <View style={styles.inputRow}>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
                <MaterialIcons name="edit" size={20} color="#666" />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Your Contact number</Text>
              <View style={styles.inputRow}>
                <TextInput style={styles.input} value={contact} onChangeText={setContact} keyboardType="phone-pad" />
                <MaterialIcons name="edit" size={20} color="#666" />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Your Address</Text>
              <View style={styles.inputRow}>
                <TextInput style={styles.input} value={address} onChangeText={setAddress} multiline={true} />
                <MaterialIcons name="edit" size={20} color="#666" />
              </View>
            </View>

            {statusMsg.text !== '' && (
              <Text style={[styles.statusText, { color: statusMsg.color }]}>{statusMsg.text}</Text>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home", { userId })}>
              <Text style={styles.backText}>Back to Home</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

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
  logo: { width: 40, height: 40, borderRadius: 20 },
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
    marginBottom: 20,
  },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerBaseText: { fontSize: 22, fontWeight: 'bold' },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  scrollContent: { padding: 20 },
  profileSection: { alignItems: 'center', marginBottom: 20 },
  profileName: { fontSize: 18, fontWeight: 'bold' },
  lastVisit: { fontSize: 12, color: '#666', marginTop: 4 },
  field: { marginBottom: 15 },
  label: { fontSize: 13, color: '#444', marginBottom: 5 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 2,
  },
  input: { flex: 1, fontSize: 14, color: '#333' },
  statusText: { textAlign: 'center', marginBottom: 10, fontWeight: 'bold', fontSize: 14 },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  backButton: { marginTop: 15, alignItems: 'center' },
  backText: { color: '#4CAF50', fontSize: 14, fontWeight: 'bold' },
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
  footerTab: { alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 12, marginTop: 4, color: '#666', fontWeight: '500' },
});