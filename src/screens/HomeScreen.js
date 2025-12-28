import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Temporary data (later replace with backend API)
    const registeredUser = {
      name: "Seniru Demitha",
      email: "seniru@gmail.com",
      address: "Colombo, Sri Lanka",
      role: "Household User"
    };

    setUser(registeredUser);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text>{user.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text>{user.email}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text>{user.address}</Text>

        <Text style={styles.label}>Role:</Text>
        <Text>{user.role}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 3
  },
  label: {
    fontWeight: "bold",
    marginTop: 10
  }
});
