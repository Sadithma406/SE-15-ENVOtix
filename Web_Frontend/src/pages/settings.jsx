import React, { useState } from "react";
import logo from "../assets/logoNoName.png";
import { useNavigate } from "react-router-dom";


function Settings() {
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(80);

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {/* LOGO */}
        <div style={styles.logoRow}>
          <img src={logo} alt="ENVOTix Logo" style={styles.logoImage} />
          <h2 style={styles.logoText}>
            <span style={styles.envoText}>ENVO</span>
            <span style={styles.tixText}>Tix</span>
          </h2>
        </div>

        {/* NAVIGATION */}
        <nav>
          <div
            style={styles.navItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.35)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.15)")
            }
            onClick={() => {navigate('/dashboard')}}
          >
            Dashboard Overview
          </div>

          <div
            style={styles.navItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.35)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.15)")
            }
            onClick={() => {navigate('/mapview')}}
          >
            Map View
          </div>

          <div style={{ ...styles.navItem, ...styles.activeNav }} 
          onClick={() => {navigate ('/settings')}}>
            Settings & Legend
          </div>
        </nav>

        {/* LOGOUT */}
        <div
          style={styles.logout}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.15)")
          }
        >
          Logout
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <h1 style={styles.title}>Settings & Legend</h1>
        <p style={styles.subtitle}>
          Customize your monitoring preferences and understand bin status indicators.
        </p>

        {/* BIN LEGEND */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Bin Fill Level Legend</h3>

          <p style={styles.text}>
            <span style={styles.greenDot}></span> 0–40% full: Mostly empty
          </p>
          <p style={styles.text}>
            <span style={styles.yellowDot}></span> 41–80% full: Monitor closely
          </p>
          <p style={styles.text}>
            <span style={styles.redDot}></span> 81–100% full: Urgent collection
          </p>

          <small style={styles.smallText}>
            Last updated: October 26, 2023, 10:30 AM
          </small>
        </section>

        {/* NOTIFICATIONS */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Notification Preferences</h3>

          <label style={styles.label}>
            <input type="checkbox" defaultChecked /> Enable Email Notifications
          </label>

          <p style={styles.text}>
            Notify when bin fill level reaches: <b>{percentage}%</b>
          </p>

          <input
            type="range"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            style={styles.range}
          />

          <label style={styles.label}>
            <input type="checkbox" defaultChecked /> Email Alerts
          </label>
          <label style={styles.label}>
            <input type="checkbox" /> SMS Alerts
          </label>
          <label style={styles.label}>
            <input type="checkbox" defaultChecked /> In-App Notifications
          </label>
        </section>

        {/* MONITORING */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Monitoring Preferences</h3>

          <label style={styles.label}>
            Data Refresh Interval:
            <select style={styles.select}>
              <option>30 Minutes</option>
              <option>1 Hour</option>
            </select>
          </label>

          <label style={styles.label}>
            Prioritize Alerts for Bin Type:
            <select style={styles.select}>
              <option>All Types</option>
              <option>Organic</option>
              <option>Plastic</option>
            </select>
          </label>
        </section>

        {/* BUTTONS */}
        <div style={styles.buttonRow}>
          <button
            style={styles.cancelBtn}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f2f2f2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffffff")
            }
          >
            Cancel
          </button>

          <button
            style={styles.saveBtn}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1b5e20")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2e7d32")
            }
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;

/* ================= STYLES ================= */

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, Arial, sans-serif",
    backgroundColor: "#f4f6f8",
    color: "#222",
  },

  sidebar: {
    width: "240px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
  },

  logoImage: {
    width: "36px",
    height: "36px",
    objectFit: "contain",
  },

  logoText: {
    fontSize: "24px",
    fontWeight: "700",
  },

  envoText: { color: "#000" },
  tixText: { color: "#ffffff" },

  navItem: {
    padding: "10px 12px",
    margin: "8px 0",
    fontSize: "15px",
    cursor: "pointer",
    borderRadius: "6px",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  activeNav: {
    fontWeight: "700",
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  logout: {
    marginTop: "auto",
    padding: "10px 12px",
    borderRadius: "6px",
    backgroundColor: "rgba(0,0,0,0.15)",
    cursor: "pointer",
    fontWeight: "600",
  },

  main: { flex: 1, padding: "30px", overflowY: "auto" },

  title: { fontSize: "28px" },
  subtitle: { fontSize: "15px", color: "#444", marginBottom: "22px" },

  card: {
    backgroundColor: "#fff",
    padding: "22px",
    borderRadius: "10px",
    marginBottom: "22px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  cardTitle: { fontSize: "19px", marginBottom: "12px" },
  text: { fontSize: "15px", marginBottom: "6px" },

  label: { display: "block", fontSize: "15px", margin: "10px 0" },
  select: { marginLeft: "10px", padding: "6px", borderRadius: "5px" },
  range: { width: "100%", margin: "10px 0" },

  buttonRow: { display: "flex", justifyContent: "flex-end", gap: "12px" },

  cancelBtn: {
    padding: "9px 18px",
    backgroundColor: "#fff",
    border: "1px solid #cfcfcf",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#333",
  },

  saveBtn: {
    padding: "9px 18px",
    backgroundColor: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  greenDot: { width: 11, height: 11, backgroundColor: "green", borderRadius: "50%", display: "inline-block", marginRight: 8 },
  yellowDot: { width: 11, height: 11, backgroundColor: "orange", borderRadius: "50%", display: "inline-block", marginRight: 8 },
  redDot: { width: 11, height: 11, backgroundColor: "red", borderRadius: "50%", display: "inline-block", marginRight: 8 },

  smallText: { fontSize: "12px", color: "#666" },
};
