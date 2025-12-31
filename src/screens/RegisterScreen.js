import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  return (
    <View style={styles.wrapper}>

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Join ENVOtix</Text>
        <Text style={styles.subtitle}>
          Your journey to smarter waste management begins here. Create an
          account to monitor your bins and earn rewards.
        </Text>

        {/* Profile Picture */}
        <TouchableOpacity style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.addPicText}>Add a profile picture</Text>

        {/* Inputs */}
        <Text style={styles.label}>Your Name</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Your Email</Text>
        <TextInput style={styles.input} keyboardType="email-address" />

        <Text style={styles.label}>Your Contact number</Text>
        <TextInput style={styles.input} keyboardType="phone-pad" />

        <Text style={styles.label}>Your Address</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Your Bin ID (mention on the bin)</Text>
        <TextInput style={styles.input} />

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  subtitle: {
    textAlign: "center",
    marginVertical: 10,
    color: "#666",
    fontSize: 13,
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: "#6BBE45",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  addPicText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 8,
  },
  label: {
    marginTop: 10,
    fontSize: 13,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#6BBE45",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
