import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import API_BASE_URL from '../config/api';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "", email: "", contactNumber: "", address: "", RFID: "", password: "", confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Exact Regex patterns
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*?#&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    
    let currentError = "";

    // Clear specific field errors when user starts typing again
    if (name === "password" && value.length > 0 && !passwordRegex.test(value)) {
      currentError = "Password must be 8+ chars, including letters, numbers, and symbols.";
    } else if (name === "confirmPassword" && value.length > 0 && value !== formData.password) {
      currentError = "Passwords do not match.";
    } else if (name === "contactNumber" && value.length > 0 && !/^\d{10}$/.test(value)) {
      currentError = "Contact number must be exactly 10 digits.";
    } else if (name === "email" || name === "name" || name === "address" || name === "RFID") {
      currentError = ""; // Clear "required" errors when typing
    }

    setErrors(prev => ({ ...prev, [name]: currentError, general: "" }));
  };

  const handleRegister = async () => {
    const { name, email, contactNumber, address, RFID, password, confirmPassword } = formData;
    let newErrors = {};

    // 1. Check for empty fields
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!contactNumber.trim()) newErrors.contactNumber = "Phone is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!RFID.trim()) newErrors.RFID = "Bin ID is required";
    if (!password.trim()) newErrors.password = "Password is required";

    // 2. Format Validations
    if (email.trim() && !emailRegex.test(email)) newErrors.email = "Please enter a valid email address.";
    if (password.trim() && !passwordRegex.test(password)) newErrors.password = "Password must be 8+ chars, with letters, numbers, and symbols.";
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match.";
    if (contactNumber.trim() && !/^\d{10}$/.test(contactNumber)) newErrors.contactNumber = "Must be 10 digits.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }    try {
      // Use computer IP if on physical device
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        name, email, contactNumber, address, RFID, password
      });

      if (response.status === 201) {
        navigation.navigate("Login"); // Direct navigation on success
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed.";
      if (error.response?.status === 409 || errorMsg.includes("RFID")) {
        setErrors({ RFID: "User already registered to this Bin ID." });
      } else if (errorMsg.includes("email")) {
        setErrors({ email: "Email already in use." });
      } else {
        setErrors({ general: errorMsg });
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
        <Text style={styles.title}>Join ENVOtix</Text>
        <Text style={styles.subtitle}>Smarter waste management starts here.</Text>

        <TouchableOpacity style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.label}>Your Name</Text>
        <TextInput 
          style={[styles.input, errors.name ? styles.inputError : null]} 
          onChangeText={(val) => handleChange("name", val)} 
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <Text style={styles.label}>Your Email</Text>
        <TextInput 
          style={[styles.input, errors.email ? styles.inputError : null]} 
          keyboardType="email-address" 
          onChangeText={(val) => handleChange("email", val)} 
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.label}>Your Contact number</Text>
        <TextInput 
          style={[styles.input, errors.contactNumber ? styles.inputError : null]} 
          keyboardType="phone-pad" 
          maxLength={10} 
          onChangeText={(val) => handleChange("contactNumber", val)} 
        />
        {errors.contactNumber ? <Text style={styles.errorText}>{errors.contactNumber}</Text> : null}

        <Text style={styles.label}>Your Address</Text>
        <TextInput 
          style={[styles.input, errors.address ? styles.inputError : null]} 
          onChangeText={(val) => handleChange("address", val)} 
        />
        {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

        <Text style={styles.label}>Your Bin ID (RFID)</Text>
        <TextInput 
          style={[styles.input, errors.RFID ? styles.inputError : null]} 
          onChangeText={(val) => handleChange("RFID", val)} 
        />
        {errors.RFID ? <Text style={styles.errorText}>{errors.RFID}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput 
            style={[styles.input, { flex: 1 }, errors.password ? styles.inputError : null]} 
            secureTextEntry={!showPassword} 
            onChangeText={(val) => handleChange("password", val)} 
          />
          <TouchableOpacity style={styles.toggleIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput 
            style={[styles.input, { flex: 1 }, errors.confirmPassword ? styles.inputError : null]} 
            secureTextEntry={!showConfirm} 
            onChangeText={(val) => handleChange("confirmPassword", val)} 
          />
          <TouchableOpacity style={styles.toggleIcon} onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons name={showConfirm ? "eye-off" : "eye"} size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

        {errors.general ? <Text style={[styles.errorText, {textAlign: 'center', marginTop: 15}]}>{errors.general}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginTop: 50 },
  subtitle: { textAlign: "center", marginVertical: 10, color: "#666", fontSize: 13 },
  avatar: { alignSelf: "center", backgroundColor: "#6BBE45", width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center", marginTop: 10 },
  label: { marginTop: 15, fontSize: 14, fontWeight: "600", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginTop: 5, fontSize: 14 },
  inputError: { borderColor: "#d93025" },
  errorText: { color: "#d93025", fontSize: 12, marginTop: 5, fontWeight: "500" },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  toggleIcon: { position: 'absolute', right: 12, top: 18 },
  button: { backgroundColor: "#1aad4f", padding: 15, borderRadius: 8, marginTop: 30 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
