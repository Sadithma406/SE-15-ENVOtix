import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView
} from "react-native";
import axios from 'axios';
import API_BASE_URL from '../config/api';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State for specific red error messages
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleLogin = async () => {
   
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let hasError = false;

    // 1. Frontend Empty Field Validation added
    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;    setLoading(true);
    try {
      // Use your local IP if testing on a real phone (e.g., http://192.168.x.x:5000)
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email: email.trim().toLowerCase(),
        password: password
      });

      if (response.status === 200) {
        // Clear inputs and navigate on success
        setEmail("");
        setPassword("");
        navigation.navigate("Home", { userId: response.data.userId });
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      // 2. Backend Error Mapping (No more alerts)
      // ha ha
      // hu uh
      // hellow
      if (status === 404) {
        setEmailError("No user account found");
      } else if (status === 401) {
        setPasswordError("Password is incorrect");
      } else {
        setGeneralError("Server connection failed. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
      
      <Image
        source={require("../../assets/whiteLogoNoBg2.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome to ENVOtix</Text>
      <Text style={styles.subtitle}>
        Login to continue managing your waste smartly
      </Text>

      {/* Email Input Section */}
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(""); // Clear error as user types
        }}
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Password Input Section */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(""); // Clear error as user types
        }}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* General System Errors (like Server Down) */}
      {generalError ? <Text style={[styles.errorText, {textAlign: 'center', marginTop: 10}]}>{generalError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}> Create one</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, justifyContent: "center", backgroundColor: "#fff" },
  logo: { width: 120, height: 120, resizeMode: "contain", alignSelf: "center", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 20, color: "#666" },
  label: { marginTop: 15, fontSize: 14, fontWeight: "600", color: "#333" },
  input: { borderWidth: 2, borderColor: "#000", borderRadius: 10, padding: 12, marginTop: 5 },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginLeft: 5, marginTop: 5, fontWeight: "500" },
  button: { backgroundColor: "#6BBE45", padding: 15, borderRadius: 8, marginTop: 25 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  forgot: { textAlign: "center", marginTop: 15, color: "#6BBE45" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  link: { color: "#6BBE45", fontWeight: "bold" },
});