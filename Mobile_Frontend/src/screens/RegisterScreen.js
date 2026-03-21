import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import axios from 'axios';
import API_BASE_URL from '../config/api';



export default function SignupScreen({ navigation }) {
  // 1. Re-integrate State
  const [formData, setFormData] = useState({
    name: "", email: "", contactNumber: "", address: "", RFID: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*?#&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 2. Re-integrate Logic
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors(prev => ({ ...prev, [name]: "", general: "" }));
  };

  const handleRegister = async () => {
    const { name, email, contactNumber, address, RFID, password, confirmPassword } = formData;
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Required";
    if (!email.trim() || !emailRegex.test(email)) newErrors.email = "Invalid email";
    if (!contactNumber.trim() || !/^\d{10}$/.test(contactNumber)) newErrors.contactNumber = "10 digits required";
    if (!address.trim()) newErrors.address = "Required";
    if (!RFID.trim()) newErrors.RFID = "Bin ID required";
    if (!password.trim() || !passwordRegex.test(password)) newErrors.password = "8+ chars, incl. symbols";
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords match error";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        name, email, contactNumber, address, RFID, password
      });

      if (response.status === 201) {
        navigation.navigate("Login");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed.";
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#333" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Up</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.card}>
          {/* Form Fields */}
          {[
            { label: 'Full Name', key: 'name', placeholder: 'John Doe' },
            { label: 'Email', key: 'email', placeholder: 'johndoe@xyz.com', keyboard: 'email-address' },
            { label: 'Contact Number', key: 'contactNumber', placeholder: '07XXXXXXXX', keyboard: 'phone-pad' },
            { label: 'Address', key: 'address', placeholder: 'Street, City' },
            { label: 'Bin ID (RFID)', key: 'RFID', placeholder: 'B21XXXXXXX' },
          ].map((field) => (
            <View key={field.key} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={[styles.input, errors[field.key] && styles.inputError]}
                placeholder={field.placeholder}
                placeholderTextColor="#999"
                keyboardType={field.keyboard || 'default'}
                value={formData[field.key]}
                onChangeText={(val) => handleChange(field.key, val)}
              />
              {errors[field.key] && <Text style={styles.errorText}>{errors[field.key]}</Text>}
            </View>
          ))}

          {/* Password Fields with Eye Toggle */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }, errors.password && styles.inputError]}
                placeholder="********"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(val) => handleChange("password", val)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }, errors.confirmPassword && styles.inputError]}
                placeholder="********"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirm}
                value={formData.confirmPassword}
                onChangeText={(val) => handleChange("confirmPassword", val)}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                {showConfirm ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {errors.general && <Text style={styles.generalError}>{errors.general}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.linkText}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10 },
  backButton: { padding: 10 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#333', marginLeft: 5 },
  scrollContent: { alignItems: 'center', paddingBottom: 40, paddingTop: 20 },
  card: {
    width: '90%',
    backgroundColor: '#6BBE45',
    borderRadius: 30,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  inputGroup: { marginBottom: 15 },
  label: { color: '#FFF', fontSize: 14, marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, color: '#333' },
  inputError: { borderWidth: 2, borderColor: '#FF5252' },
  passWrapper: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center' },
  eyeIcon: { paddingHorizontal: 10 },
  errorText: { color: '#FFCDD2', fontSize: 11, marginTop: 4, fontWeight: 'bold' },
  generalError: { color: '#FFCDD2', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  button: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  footerText: { color: '#FFF', textAlign: 'center', fontSize: 13 },
  linkText: { fontWeight: 'bold', textDecorationLine: 'underline' }
});