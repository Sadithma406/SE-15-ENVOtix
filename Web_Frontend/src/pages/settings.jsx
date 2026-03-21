import React, { useState } from "react";
import logo from "../assets/logoNoName.png";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(80);

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Envotix logo" style={styles.logoImage} />
            <div style={styles.brand}>
              <div style={styles.brandTitle}>
                <span style={{ color: "#000" }}>ENVO</span>
                <span style={{ color: "#fff" }}>tix</span>
              </div>
              <span style={styles.brandSubtitle}>smart waste management</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav style={styles.nav}>
          <button
            style={styles.navItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onClick={() => navigate("/dashboard")}
          >
            📊 Dashboard Overview
          </button>

          <button
            style={styles.navItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onClick={() => navigate("/mapview")}
          >
            🗺️ Map View
          </button>

          <button
            style={{ ...styles.navItem, ...styles.active }}
            onClick={() => navigate("/settings")}
          >
            ⚙️ Settings & Legend
          </button>
        </nav>

        {/* LOGOUT */}
        <div style={styles.sidebarFooter}>
          <button
            style={styles.navItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onClick={() => navigate("/")}
          >
            🚪 Logout
          </button>
          <p style={styles.copyright}>© ENVOtix smart waste management</p>
        </div>
      </aside>

      {/* RIGHT SIDE CONTAINER */}
      <div style={styles.rightContainer}>
        <header style={styles.topbar}>
          <h1 style={styles.title}>Settings & Legend</h1>
          <div style={styles.topRight}>
            <div style={styles.avatar}>A</div>
          </div>
        </header>

        <main style={styles.main}>
          <p style={styles.subtitle}>
            Customize your monitoring preferences and understand bin status indicators.
          </p>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Bin Fill Level Legend</h3>
            <p style={styles.text}><span style={styles.greenDot}></span> 0–40% full: Mostly empty</p>
            <p style={styles.text}><span style={styles.yellowDot}></span> 41–80% full: Monitor closely</p>
            <p style={styles.text}><span style={styles.redDot}></span> 81–100% full: Urgent collection</p>
            <small style={styles.smallText}>Last updated: October 26, 2023, 10:30 AM</small>
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Notification Preferences</h3>
            <label style={styles.label}><input type="checkbox" defaultChecked /> Enable Email Notifications</label>
            <p style={styles.text}>Notify when bin fill level reaches: <b>{percentage}%</b></p>
            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              style={styles.range}
            />
            <label style={styles.label}><input type="checkbox" defaultChecked /> Email Alerts</label>
            <label style={styles.label}><input type="checkbox" /> SMS Alerts</label>
            <label style={styles.label}><input type="checkbox" defaultChecked /> In-App Notifications</label>
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Monitoring Preferences</h3>
            <label style={styles.label}>
              Data Refresh Interval:
              <select style={styles.select}>
                <option>15 Minutes</option>
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
                <option>Paper</option>
              </select>
            </label>
          </section>

          {/* ACTION BUTTONS */}
          <div style={styles.buttonRow}>
            <button
              style={styles.cancelBtn}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button
              style={styles.saveBtn}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#256629")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2e7d32")}
              onClick={() => alert("Changes saved successfully!")}
            >
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "system-ui",
    background: "#f5f5f5",
    overflow: "hidden"
  },
  sidebar: {
    width: "260px",
    background: "#28a745",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    flexShrink: 0
  },
  rightContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  sidebarHeader: {
    marginBottom: "40px"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  logoImage: {
    width: "40px",
    height: "40px",
    objectFit: "contain"
  },
  brand: {
    display: "flex",
    flexDirection: "column"
  },
  brandTitle: {
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "0.5px"
  },
  brandSubtitle: {
    fontSize: "11px",
    opacity: 0.9,
    color: "white"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  navItem: {
    border: "none",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    padding: "12px 16px",
    borderRadius: "10px",
    textAlign: "left",
    cursor: "pointer",
    width: "100%",
    fontSize: "15px",
    display: "block",
    transition: "background 0.3s ease"
  },
  active: {
    background: "rgba(0,0,0,0.3)",
    fontWeight: "700",
    borderLeft: "4px solid white"
  },
  sidebarFooter: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  copyright: {
    fontSize: "11px",
    opacity: 0.8
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 28px",
    background: "#28a745",
    color: "white"
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "25px",
    overflowY: "auto"
  },
  title: {
    fontSize: "28px",
    margin: 0
  },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "white",
    color: "#28a745",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600
  },
  subtitle: {
    fontSize: "15px",
    color: "#444",
    marginBottom: "22px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  cardTitle: {
    fontSize: "19px",
    marginBottom: "12px",
    marginTop: 0
  },
  text: {
    fontSize: "15px",
    marginBottom: "6px"
  },
  label: {
    display: "block",
    fontSize: "15px",
    margin: "10px 0"
  },
  select: {
    marginLeft: "10px",
    padding: "6px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  range: {
    width: "100%",
    margin: "10px 0",
    cursor: "pointer"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
    paddingBottom: "20px"
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "#fff",
    border: "1px solid #cfcfcf",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#333",
    transition: "background 0.2s ease"
  },
  saveBtn: {
    padding: "10px 20px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.2s ease"
  },
  greenDot: {
    width: 10,
    height: 10,
    background: "#43a047",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: 8
  },
  yellowDot: {
    width: 10,
    height: 10,
    background: "#ffb300",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: 8
  },
  redDot: {
    width: 10,
    height: 10,
    background: "#e53935",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: 8
  },
  smallText: {
    fontSize: "12px",
    color: "#666"
  }
};

export default Settings;