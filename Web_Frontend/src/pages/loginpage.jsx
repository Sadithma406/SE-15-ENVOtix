import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BgImage from "../assets/bg.jpg";
import Logo from"../assets/logoNoName.png";


export default function LoginPage() {
  const navigate = useNavigate(); //  navigation hook

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS

      console.log("Login successful ✅", data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      // navigate AFTER a tiny delay to ensure state updates
      setTimeout(() => navigate("/dashboard"), 50);

      //setMessage("Login successful ");
      //console.log("Logged user:", data.user);

      // later:
      // localStorage.setItem("user", JSON.stringify(data.user));
      // navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error); 
      setMessage("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <img src={Logo} alt="Envotix Logo" style={styles.logo} />
          <h2 style={styles.title}>Welcome to Envotix!</h2>
        </div>

        {/* Message */}
        {message && (
          <p style={{ textAlign: "center", color: "red", marginBottom: 10 }}>
            {message}
          </p>
        )}

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

        {/* Password */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Type your password here"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button style={styles.loginBtn} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${BgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    width: 380,
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  logoSection: {
    textAlign: "center",
    marginBottom: 25,
  },
  logo: {
    width: 60,
    marginBottom: 10,
  },
  title: {
    margin: 0,
    color: "#333",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    display: "block",
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  loginBtn: {
    width: "100%",
    padding: 12,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
  },
};
