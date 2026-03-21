import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, Dimensions, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Image
} from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/api';


const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  // --- Backend State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // --- Error States ---
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleLogin = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let hasError = false;
    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email: email.trim().toLowerCase(),
        password: password
      });

      if (response.status === 200) {
        setEmail("");
        setPassword("");
        // Navigate to Home with the User ID
        navigation.navigate("Home", { userId: response.data.userId });
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        setEmailError("No account found");
      } else if (status === 401) {
        setPasswordError("Incorrect password");
      } else {
        setGeneralError("Connection failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

          {/* Top Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logoNoNameBg.png')}
              style={styles.logoImage}
            />
            <Text style={styles.brandName}>ENVOtix</Text>
          </View>

          {/* Card Content */}
          <View style={styles.card}>
            <Text style={styles.title}>Log In</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="johndoe@xyz.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                secureTextEntry
                placeholder="************"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
            {generalError ? <Text style={styles.generalErrorText}>{generalError}</Text> : null}

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 100, height: 100, resizeMode: 'contain' },
  brandName: { fontSize: 24, fontWeight: 'bold', color: '#006B4D', marginTop: 10 },
  card: {
    width: width * 0.9,
    maxWidth: 450,
    backgroundColor: '#6BBE45',
    borderRadius: 30,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 25 },
  inputGroup: { marginBottom: 15 },
  label: { color: '#FFF', fontSize: 14, marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, fontSize: 14, color: '#333' },
  inputError: { borderWidth: 2, borderColor: '#FFCDD2' },
  errorText: { color: '#FFCDD2', fontSize: 11, marginTop: 5, fontWeight: 'bold' },
  generalErrorText: { color: '#FFCDD2', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#FFF', borderRadius: 4, marginRight: 8 },
  checked: { backgroundColor: '#4CAF50' },
  smallText: { color: '#FFF', fontSize: 12 },
  forgotText: { color: '#FFF', fontSize: 12, textDecorationLine: 'underline' },
  button: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  orText: { color: '#FFF', textAlign: 'center', fontSize: 12, marginBottom: 15 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 20 },
  footerText: { color: '#FFF', textAlign: 'center', fontSize: 13 },
  linkText: { fontWeight: 'bold', textDecorationLine: 'underline' }
});