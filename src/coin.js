{/* Header Section */}
<View style={styles.header}>
  <Image 
    source={require('../../images/whiteLogoNoBg2.png')}
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

{/* Footer Section */}
<View style={styles.footer}>
  <View style={styles.footerTab}>
    <Home color="#666" size={24} />
    <Text style={styles.footerText}>Home</Text>
  </View>

  <View style={styles.footerTab}>
    <Wallet color="#666" size={24} />
    <Text style={styles.footerText}>Coins</Text>
  </View>

  <View style={styles.footerTab}>
    <Store color="#666" size={24} />
    <Text style={styles.footerText}>Shops</Text>
  </View>
</View>

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F5F5F5',
  },

  header: { 
    backgroundColor: '#4CAF50', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
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

  headerBaseText: {
    flexDirection: 'row',
  },

  envoText: { 
    color: 'green', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },

  tixText: { 
    color: 'black', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },

  headerIcons: { 
    flexDirection: 'row' 
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
});

