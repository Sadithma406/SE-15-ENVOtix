import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff } from 'lucide-react';
import BgImage from "../assets/bg.jpg";
import Logo from "../assets/logoNoName.png";

// Helper function to decode JWT token
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" or "success"
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission reload
    if (!email || !password) {
      setMessage("Please enter email and password");
      setMessageType("error");
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessage(data.message || "Login failed");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS
      console.log("Login successful ✅", data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => navigate("/dashboard"), 50);

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Cannot connect to server");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In Success
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = decodeJwt(credentialResponse.credential);
      if (!decoded) {
        setMessage("Failed to decode Google credentials");
        setMessageType("error");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decoded.email,
          googleId: decoded.sub,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Google login failed");
        setMessageType("error");
        return;
      }

      // ✅ SUCCESS
      console.log("Google Login successful ✅", data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => navigate("/dashboard"), 50);

    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Cannot connect to server");
      setMessageType("error");
    }
  };

  const handleGoogleError = () => {
    setMessage("Google sign-in failed. Please try again.");
    setMessageType("error");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <img src={Logo} alt="Envotix Logo" style={styles.logo} />
          <h2 style={styles.title}>Welcome Back!</h2>
          <p style={styles.subtitle}>Sign in to your account to continue.</p>
        </div>

        {/* Dynamic Message */}
        {message && (
          <p style={messageType === "error" ? styles.errorMessage : styles.successMessage}>
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="example@municipalcouncil.lk"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password with Toggle */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Type your password here"
                style={{ ...styles.input, paddingRight: "40px" }} // Make room for icon
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                style={styles.toggleIcon} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            style={loading ? {...styles.loginBtn, ...styles.loginBtnDisabled} : styles.loginBtn} 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine}></span>
          </div>

          {/* Google Sign-In */}
          <div style={styles.googleBtnWrapper}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="pill"
              width="100%"
            />
          </div>

          {/* Sign Up Link */}
          <p style={styles.signupText}>
            Don't have an account? <a href="/signup" style={styles.signupLink}>Sign Up</a>
          </p>
        </form>

      </div>
    </div>
  );
}

// Inline Styles Object
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${BgImage})`, // Fixed template literal syntax here
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    width: 380,
    padding: "30px 40px",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    boxSizing: "border-box"
  },
  logoSection: {
    textAlign: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    marginBottom: 10,
  },
  title: {
    margin: 0,
    color: "#1aad4f",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    margin: "8px 0 15px 0",
  },
  errorMessage: {
    textAlign: "center",
    color: "#d93025",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 15,
  },
  successMessage: {
    textAlign: "center",
    color: "#1aad4f",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 15,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: 15,
    textAlign: "left"
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#333",
    marginBottom: 6,
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none"
  },
  toggleIcon: {
    position: "absolute",
    right: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },
  loginBtn: {
    width: "100%",
    padding: 12,
    marginTop: 5,
    background: "#1aad4f",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  loginBtnDisabled: {
    background: "#88d4a0",
    cursor: "not-allowed",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
  },
  dividerLine: {
    flex: 1,
    borderBottom: "1px solid #ccc",
  },
  dividerText: {
    padding: "0 10px",
    color: "#666",
    fontSize: 14,
  },
  googleBtnWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
  signupLink: {
    color: "#1aad4f",
    fontWeight: "bold",
    textDecoration: "none",
  }
};