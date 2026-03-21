import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import logo from "../assets/logoNoName.png";

// Fix for default marker icons
if (L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function RecenterMap({ bins }) {
  const map = useMap();
  useEffect(() => {
    if (bins && bins.length > 0 && bins[0].coordinates) {
      map.setView([bins[0].coordinates.lat, bins[0].coordinates.lng], 13);
    }
  }, [bins, map]);
  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const [selectedBin, setSelectedBin] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        setError(null);
        const response = await axios.get("http://localhost:5000/api/lanebins");
        const rawData = response.data;
        if (!Array.isArray(rawData)) throw new Error("Invalid data format");

        const groupedBins = {};
        rawData.forEach((bin) => {
          if (!bin.location || !bin.location.latitude || !bin.location.longitude) return;
          const key = `${bin.laneName}-${bin.location.latitude}-${bin.location.longitude}`;
          if (!groupedBins[key]) {
            groupedBins[key] = {
              _id: bin._id,
              name: bin.laneName,
              location: bin.laneName,
              coordinates: { lat: bin.location.latitude, lng: bin.location.longitude },
              fillLevels: { organic: 0, plastic: 0, paper: 0 },
            };
          }
          const binType = bin.binType.toLowerCase();
          groupedBins[key].fillLevels[binType] = Math.min(bin.fillLevel || 0, 100);
        });

        setBins(Object.values(groupedBins));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setBins([{ _id: "101", name: "Sample Bin", location: "Downtown Plaza", coordinates: { lat: 6.8792, lng: 79.8853 }, fillLevels: { organic: 86, plastic: 68, paper: 42 } }]);
        setLoading(false);
      }
    };
    fetchBins();
  }, []);

  const getFillLevelClass = (percentage) => {
    if (percentage >= 80) return "high";
    if (percentage >= 40) return "medium";
    return "low";
  };

  const createBinIcon = (bin) => {
    const colors = { low: "#43a047", medium: "#ffb300", high: "#e53935" };
    const dots = [
      getFillLevelClass(bin.fillLevels?.organic || 0),
      getFillLevelClass(bin.fillLevels?.plastic || 0),
      getFillLevelClass(bin.fillLevels?.paper || 0),
    ];

    const svgIcon = `
      <svg width="44" height="60" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 0C10 0 0 10 0 22c0 12 22 38 22 38s22-26 22-38C44 10 34 0 22 0z" fill="#28a745" stroke="#fff" stroke-width="2"/>
        <g transform="translate(11, 8)">
          <rect x="0" y="0" width="22" height="3" rx="1" fill="#1a1a1a"/>
          <rect x="8" y="-2" width="6" height="3" rx="1" fill="#1a1a1a"/>
          <path d="M2 4 L4 22 L18 22 L20 4 Z" fill="#1a1a1a"/>
        </g>
        <circle cx="12" cy="48" r="4" fill="${colors[dots[0]]}" stroke="#fff" stroke-width="1"/>
        <circle cx="22" cy="48" r="4" fill="${colors[dots[1]]}" stroke="#fff" stroke-width="1"/>
        <circle cx="32" cy="48" r="4" fill="${colors[dots[2]]}" stroke="#fff" stroke-width="1"/>
      </svg>`;

    return L.divIcon({ className: "custom-bin-icon", html: svgIcon, iconSize: [44, 60], iconAnchor: [22, 60], popupAnchor: [0, -60] });
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logoImage} />
            <div style={styles.brand}>
              <div style={styles.brandTitle}>
                <span style={{ color: "#000" }}>ENVO</span>
                <span style={{ color: "#fff" }}>tix</span>
              </div>
              <span style={styles.brandSubtitle}>smart waste management</span>
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          <button
            style={styles.navItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onClick={() => navigate("/dashboard")}
          >
            📊 Dashboard Overview
          </button>
          <button style={{ ...styles.navItem, ...styles.active }} onClick={() => navigate("/mapview")}>
            🗺️ Map View
          </button>
          <button
            style={styles.navItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onClick={() => navigate("/settings")}
          >
            ⚙️ Settings & Legend
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button
            style={{ ...styles.navItem, ...styles.logoutBtn }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
            onClick={() => navigate("/")}
          >
            🚪 Logout
          </button>
          <p style={styles.copyright}>© ENVOtix smart waste management</p>
        </div>
      </aside>

      {/* RIGHT CONTAINER */}
      <div style={styles.rightContainer}>
        <header style={styles.topbar}>
          <h1 style={styles.title}>Map View</h1>
          <div style={{ ...styles.topRight, position: 'relative' }}>
            {/* Search bar removed */}
            <button
              className="profile-avatar"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              A
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-info">
                  <p className="profile-name">Admin User</p>
                  <p className="profile-id">ID: ENV-001</p>
                </div>
                <button className="profile-logout-btn" onClick={() => navigate("/")}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <main style={styles.main}>
          <div style={styles.mapWrapper}>
            {loading ? (
              <div style={styles.loading}>Loading map data...</div>
            ) : (
              <MapContainer center={[6.9271, 79.8612]} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap bins={bins} />
                {bins.map((bin) => (
                  <Marker
                    key={bin._id}
                    position={[bin.coordinates.lat, bin.coordinates.lng]}
                    icon={createBinIcon(bin)}
                    eventHandlers={{ click: () => setSelectedBin(bin) }}
                  >
                    <Popup>{bin.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}

            {selectedBin && (
              <div style={styles.clusterCard}>
                <button style={styles.closeBtn} onClick={() => setSelectedBin(null)}>×</button>
                <h3 style={{ margin: "0 0 5px 0" }}>{selectedBin.name}</h3>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>{selectedBin.location}</p>
                {['organic', 'plastic', 'paper'].map(type => (
                  <div key={type} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ textTransform: 'capitalize' }}>{type}</span>
                      <span style={{ fontWeight: '600' }}>{selectedBin.fillLevels[type]}%</span>
                    </div>
                    <div style={styles.progBg}>
                      <div style={{
                        ...styles.progFill,
                        width: `${selectedBin.fillLevels[type]}%`,
                        backgroundColor: selectedBin.fillLevels[type] >= 81 ? '#e53935' : (selectedBin.fillLevels[type] >= 41 ? '#ffb300' : '#43a047')
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .profile-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #28a745;
          font-weight: 700;
          cursor: pointer;
          border: none;
          padding: 0;
          transition: background 0.2s;
        }
        
        .profile-avatar:hover {
          background: #f0f0f0;
        }

        .profile-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          width: 200px;
          overflow: hidden;
          z-index: 2000;
          color: #333;
        }

        .profile-dropdown-info {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }

        .profile-name {
          margin: 0;
          font-weight: 600;
          font-size: 14px;
          color: #333;
        }

        .profile-id {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #666;
        }

        .profile-logout-btn {
          width: 100%;
          padding: 12px 15px;
          border: none;
          background: none;
          text-align: left;
          font-size: 14px;
          color: #e53935;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .profile-logout-btn:hover {
          background: #ffebee;
        }
      `}</style>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "#f5f5f5",
    overflow: "hidden",
    fontFamily: "system-ui"
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
    fontWeight: 800
  },
  brandSubtitle: {
    fontSize: "11px",
    opacity: 0.9
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
    fontSize: "15px",
    width: "100%",
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
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    fontWeight: "600"
  },
  copyright: {
    fontSize: "11px",
    opacity: 0.8
  },
  rightContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 28px",
    background: "#28a745",
    color: "white"
  },
  title: {
    fontSize: "24px",
    margin: 0,
    fontWeight: "600"
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
    fontWeight: 700
  },
  main: {
    flex: 1,
    padding: "20px",
    position: "relative"
  },
  mapWrapper: {
    height: "100%",
    width: "100%",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    position: "relative"
  },
  loading: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eee"
  },
  clusterCard: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1000,
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "260px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 12,
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    color: "#999"
  },
  progBg: {
    height: 6,
    background: "#eee",
    borderRadius: 3,
    marginTop: 4,
    overflow: "hidden"
  },
  progFill: {
    height: "100%",
    borderRadius: 3
  }
};