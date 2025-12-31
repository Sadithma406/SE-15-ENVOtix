import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('Sanath Silva');
  const [email, setEmail] = useState('sanath.s@yahoo.com');
  const [contact, setContact] = useState('+94 777 234 123');
  const [address, setAddress] = useState('23, Street Avenue, Colombo');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerBaseText}>
            <Text style={styles.envoText}>ENVO</Text>
            <Text style={styles.tixText}>tix</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Edit Profile</Text>
        </View>
        <View style={styles.headerIcons}>
          <MaterialIcons name="notifications-none" size={24} color="black" style={{ marginRight: 15 }} />
          <MaterialIcons name="menu" size={26} color="black" />
        </View>
      </View>

      {/* ================= BODY ================= */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
        
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.lastVisit}>Last visit: 20/11/2025</Text>
        </View>

        {/* Editable Fields */}
        <View style={styles.field}>
          <Text style={styles.label}>Your Name</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={true}
            />
            <MaterialIcons name="edit" size={20} color="#666" />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Your Email</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={true}
              keyboardType="email-address"
            />
            <MaterialIcons name="edit" size={20} color="#666" />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Your Contact number</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={contact}
              onChangeText={setContact}
              editable={true}
              keyboardType="phone-pad"
            />
            <MaterialIcons name="edit" size={20} color="#666" />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Your Address</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              editable={true}
              multiline={true}
            />
            <MaterialIcons name="edit" size={20} color="#666" />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={() => alert('Changes saved!')}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Back to Home */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ================= FOOTER ================= */}
      <View style={styles.footer}>
        <View style={styles.footerTab}>
          <Ionicons name="home" size={24} color="#666" />
          <Text style={styles.footerText}>Home</Text>
        </View>
        <View style={styles.footerTab}>
          <Ionicons name="wallet" size={24} color="#666" />
          <Text style={styles.footerText}>Coins</Text>
        </View>
        <View style={styles.footerTab}>
          <Ionicons name="storefront" size={24} color="#666" />
          <Text style={styles.footerText}>Shops</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },

  /* HEADER */
  logo: { width: 40, height: 40, borderRadius: 20 },
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 0,
    marginHorizontal: -20,
    paddingTop: 30,
  },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerBaseText: { fontSize: 22, fontWeight: 'bold' },
  envoText: { color: 'green', fontSize: 22, fontWeight: 'bold' },
  tixText: { color: 'black', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, color: '#fff', marginTop: 4 },
  headerIcons: { flexDirection: 'row' },

  /* BODY */
  content: { padding: 20, paddingBottom: 100 },
  profileSection: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
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

  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  backButton: { marginTop: 15, alignItems: 'center' },
  backText: { color: '#4CAF50', fontSize: 14, fontWeight: 'bold' },

  /* FOOTER */
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
