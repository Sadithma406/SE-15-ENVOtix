import React from "react";

export default function LoginPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo & Title */}
        <div style={styles.logoSection}>
          <img
            src="/logo.png" // replace with your logo
            alt="Envotix Logo"
            style={styles.logo}
          />
          <h2 style={styles.title}>Welcome to Envotix!</h2>
        </div>

        {/* Email */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="example@mc.gov.lk"
            style={styles.input}
          />
        </div>

        {/* Password */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Type your password here"
            style={styles.input}
          />
        </div>

        {/* Links */}
        <div style={styles.links}>
          <a href="#" style={styles.link}>Create Account</a>
          <a href="#" style={styles.link}>Forgot Password?</a>
        </div>

        {/* Login Button */}
        <button style={styles.loginBtn}>Login</button>

        {/* Divider */}
        <div style={styles.divider}>OR</div>

        {/* Google Login */}
        <button style={styles.googleBtn}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            style={{ width: 18 }}
          />
          Log in with Google
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
    background: "linear-gradient(135deg, #4caf50, #2e7d32)",
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
    outline: "none",
  },
  links: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginBottom: 20,
  },
  link: {
    color: "#2e7d32",
    textDecoration: "none",
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
  divider: {
    textAlign: "center",
    margin: "18px 0",
    color: "#999",
    fontSize: 13,
  },
  googleBtn: {
    width: "100%",
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
};
