// Notification.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  StatusBar
} from 'react-native';
import { Bell, Menu, Home, Wallet, Store, Trash2, CheckCircle, Circle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notification() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#F5F5F5' }}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../images/whiteLogoNoBg2.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.headerTextContainer}>
            <Text>
              <Text style={styles.envoText}>ENVO</Text>
              <Text style={styles.tixText}>tix</Text>
            </Text>
          </View>

          <View style={styles.headerIcons}>
            <Bell size={24} color="#FFF" style={{ marginRight: 15 }} />  {/* White notification icon */}
            <Menu size={24} color="black" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.pageTitleRow}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.pageTitle}>Notifications</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            <View style={styles.item}>
              <Circle size={20} color="#4CAF50" />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Action Needed: Organic waste filled</Text>
                <Text style={styles.itemDate}>2025-11-01</Text>
              </View>
              <Trash2 size={20} color="#666" />
            </View>

            <View style={styles.divider} />

            <View style={styles.item}>
              <CheckCircle size={20} color="#4CAF50" />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Action Needed: Plastic waste filled</Text>
                <Text style={styles.itemDate}>2025-10-24</Text>
              </View>
              <Trash2 size={20} color="#666" />
            </View>

            <View style={styles.divider} />

            <View style={styles.item}>
              <CheckCircle size={20} color="#4CAF50" />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Glass bin emptied</Text>
                <Text style={styles.itemDate}>2025-10-20</Text>
              </View>
              <Trash2 size={20} color="#666" />
            </View>

            <View style={styles.divider} />

            <View style={styles.item}>
              <Circle size={20} color="#4CAF50" />
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>Waste added to the organic bin</Text>
                <Text style={styles.itemDate}>2025-10-16</Text>
              </View>
              <Trash2 size={20} color="#666" />
            </View>

          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTab}>
          <Home size={24} color="#666" />
          <Text style={styles.footerText}>Home</Text>
        </View>

        <View style={styles.footerTab}>
          <Wallet size={24} color="#666" />  {/* Coins icon stays grey on Notification page */}
          <Text style={styles.footerText}>Coins</Text>
        </View>

        <View style={styles.footerTab}>
          <Store size={24} color="#666" />
          <Text style={styles.footerText}>Shops</Text>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  logo: {
    width: 40,
    height: 40,
  },

  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },

  envoText: {
    color: 'green',
    fontSize: 22,
    fontWeight: 'bold',
  },

  tixText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },

  headerIcons: {
    flexDirection: 'row',
  },

  content: {
    flex: 1,
    padding: 16,
  },

  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  backArrow: {
    fontSize: 26,
    marginRight: 8,
    color: '#000',
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  itemText: {
    flex: 1,
    marginLeft: 10,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  itemDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEE',
  },

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
});