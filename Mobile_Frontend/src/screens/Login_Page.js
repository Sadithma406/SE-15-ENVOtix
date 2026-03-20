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
import axios from "axios";
import API_BASE_URL from "../config/api";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleLogin = async () => {
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
      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        {
          email: email.trim().toLowerCase(),
          password: password
        }
      );

      if (response.status === 200) {
        setEmail("");
        setPassword("");
        navigation.navigate("Home", {
          userId: response.data.userId
        });
      }
    } catch (error) {
      const status = error.response?.status;

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
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="always"
    >
      <Image
        source={require("../../assets/whiteLogoNoBg2.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome to ENVOtix</Text>
      <Text style={styles.subtitle}>
        Login to continue managing your waste smartly
      </Text>

      {/* Email */}
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={[
            styles.input,
            { flex: 1 },
            passwordError && styles.inputError
          ]}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {generalError ? (
        <Text style={[styles.errorText, { textAlign: "center" }]}>
          {generalError}
        </Text>
      ) : null}

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
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
  container: {
    flexGrow: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center"
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666"
  },
  label: {
    marginTop: 15,
    fontWeight: "600"
  },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    padding: 12,
    marginTop: 5
  },
  inputError: {
    borderColor: "red"
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5
  },
  button: {
    backgroundColor: "#6BBE45",
    padding: 15,
    borderRadius: 8,
    marginTop: 25
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  forgot: {
    textAlign: "center",
    marginTop: 15,
    color: "#6BBE45"
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25
  },
  link: {
    color: "#6BBE45",
    fontWeight: "bold"
  }
});