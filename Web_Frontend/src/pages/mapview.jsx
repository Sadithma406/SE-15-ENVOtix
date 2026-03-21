import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
if (L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to recenter map when bins load - MUST be outside main component
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

  // Fetch bins from MongoDB via API (lane_bins collection)
  useEffect(() => {
    const fetchBins = async () => {
      try {
        setError(null);
        const response = await axios.get("http://localhost:5000/api/lanebins");
        const rawData = response.data;

        if (!Array.isArray(rawData)) {
          console.error("API did not return an array:", rawData);
          throw new Error("Invalid data format");
        }

        // Group bins by laneName and location to create clusters
        const groupedBins = {};
        rawData.forEach((bin) => {
          if (!bin.location || !bin.location.latitude || !bin.location.longitude) {
            return;
          }

          const key = `${bin.laneName}-${bin.location.latitude}-${bin.location.longitude}`;
          if (!groupedBins[key]) {
            groupedBins[key] = {
              _id: bin._id,
              bin_id: bin._id,
              name: bin.laneName,
              location: bin.laneName,
              coordinates: { lat: bin.location.latitude, lng: bin.location.longitude },
              fillLevels: { organic: 0, plastic: 0, paper: 0 },
              lastUpdated: bin.lastUpdated,
            };
          }
          const binType = bin.binType.toLowerCase();
          groupedBins[key].fillLevels[binType] = Math.min(bin.fillLevel || 0, 100);
        });

        const binsArray = Object.values(groupedBins);
        console.log("Processed bins:", binsArray);
        setBins(binsArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bins:", err);
        setError(err.message);
        // Fallback to sample data if API fails
        setBins([
          {
            _id: "101",
            bin_id: "101",
            name: "Bin Cluster 101",
            location: "Downtown Eco Plaza",
            coordinates: { lat: 6.8792, lng: 79.8853 },
            fillLevels: { organic: 86, plastic: 68, paper: 42 },
          },
        ]);
        setLoading(false);
      }
    };
    fetchBins();
  }, []);

  // Show error state
  if (error && bins.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <p style={{ color: "red", marginBottom: "10px" }}>Error loading map data: {error}</p>
        <p>Make sure your backend server is running on port 5000</p>
      </div>
    );
  }

  // Helper function to determine fill level color
  const getFillLevel = (percentage) => {
    if (percentage >= 70) return "high";
    if (percentage >= 40) return "medium";
    return "low";
  };

  // Create custom bin icon with colored dots
  const createBinIcon = (bin) => {
    const dots = [
      getFillLevel(bin.fillLevels?.organic || 0),
      getFillLevel(bin.fillLevels?.plastic || 0),
      getFillLevel(bin.fillLevels?.paper || 0),
    ];

    const colors = {
      low: "#43a047",
      medium: "#ffb300",
      high: "#e53935",
    };    const svgIcon = `
      <svg width="44" height="60" xmlns="http://www.w3.org/2000/svg">
        <!-- Pin shape background -->
        <path d="M22 0C10 0 0 10 0 22c0 12 22 38 22 38s22-26 22-38C44 10 34 0 22 0z" fill="#28a745" stroke="#fff" stroke-width="2"/>
        
        <!-- Trash bin icon (black) -->
        <g transform="translate(11, 8)">
          <!-- Bin lid -->
          <rect x="0" y="0" width="22" height="3" rx="1" fill="#1a1a1a"/>
          <!-- Lid handle -->
          <rect x="8" y="-2" width="6" height="3" rx="1" fill="#1a1a1a"/>
          <!-- Bin body -->
          <path d="M2 4 L4 22 L18 22 L20 4 Z" fill="#1a1a1a"/>
          <!-- Bin lines -->
          <line x1="7" y1="7" x2="7" y2="19" stroke="#28a745" stroke-width="1.5"/>
          <line x1="11" y1="7" x2="11" y2="19" stroke="#28a745" stroke-width="1.5"/>
          <line x1="15" y1="7" x2="15" y2="19" stroke="#28a745" stroke-width="1.5"/>
        </g>
        
        <!-- Three colored dots underneath -->
        <circle cx="12" cy="48" r="4" fill="${colors[dots[0]]}" stroke="#fff" stroke-width="1"/>
        <circle cx="22" cy="48" r="4" fill="${colors[dots[1]]}" stroke="#fff" stroke-width="1"/>
        <circle cx="32" cy="48" r="4" fill="${colors[dots[2]]}" stroke="#fff" stroke-width="1"/>
      </svg>
    `;    return L.divIcon({
      className: "custom-bin-icon",
      html: svgIcon,
      iconSize: [44, 60],
      iconAnchor: [22, 60],
      popupAnchor: [0, -60],
    });
  };

  const handleBinClick = (bin) => {
    setSelectedBin(selectedBin?._id === bin._id ? null : bin);
  };

  // Default center (Sri Lanka - Colombo area)
  const defaultCenter = [6.9271, 79.8612];
  const defaultZoom = 12;

  return (
    <>
      <div className="mapview-root">
        {/* Sidebar */}
        <aside className="mapview-sidebar">
          <div className="sidebar-header">
            <div className="logo-circle">
              <span className="logo-letter">E</span>
            </div>
            <div className="sidebar-brand">
              <span className="brand-title">ENVOtix</span>
              <span className="brand-subtitle">smart waste management</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-item" onClick={() => navigate("/dashboard")}>
              <span className="nav-icon">📊</span>
              <span>Dashboard Overview</span>
            </button>

            <button className="nav-item nav-item-active" onClick={() => navigate("/mapview")}>
              <span className="nav-icon">🗺️</span>
              <span>Map View</span>
            </button>

            <button className="nav-item" onClick={() => navigate("/settings")}>
              <span className="nav-icon">⚙️</span>
              <span>Settings or Legend</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn">Logout</button>
            <p className="sidebar-copy">©️ ENVOtix smart waste management</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="mapview-main">
          {/* Top Bar */}
          <header className="mapview-topbar">
            <h1 className="topbar-title">Waste Management Dashboard</h1>

            <div className="topbar-right">
              <div className="topbar-search">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search..." className="search-input" />
              </div>

              <div className="profile-avatar">
                <span className="avatar-initial">A</span>
              </div>
            </div>
          </header>

          {/* Map Container */}
          <section className="mapview-map-wrapper">
            <div className="map-area">
              {loading ? (
                <div className="loading-spinner">Loading bins...</div>
              ) : (
                <MapContainer
                  key="envotix-map"
                  center={defaultCenter}
                  zoom={defaultZoom}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  <RecenterMap bins={bins} />

                  {bins.map((bin) => {
                    if (!bin.coordinates || !bin.coordinates.lat || !bin.coordinates.lng) {
                      return null;
                    }
                    return (
                      <Marker
                        key={bin._id || bin.bin_id}
                        position={[bin.coordinates.lat, bin.coordinates.lng]}
                        icon={createBinIcon(bin)}
                        eventHandlers={{
                          click: () => handleBinClick(bin),
                        }}
                      >
                        <Popup>
                          <div style={{ textAlign: "center" }}>
                            <strong>{bin.name || `Bin ${bin.bin_id}`}</strong>
                            <br />
                            <small>{bin.location || "Unknown Location"}</small>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}

              {/* Bin Cluster Card - Shows when bin is clicked */}
              {selectedBin && (
                <div className="bin-cluster-card">
                  <button className="close-btn" onClick={() => setSelectedBin(null)}>
                    ×
                  </button>
                  <h3 className="cluster-title">{selectedBin.name || `Bin Cluster ${selectedBin.bin_id}`}</h3>
                  <p className="cluster-location">{selectedBin.location || "Unknown Location"}</p>

                  <div className="cluster-row">
                    <span>🍃 Organic</span>
                    <span>{selectedBin.fillLevels?.organic || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getFillLevel(selectedBin.fillLevels?.organic || 0)}`}
                      style={{ width: `${selectedBin.fillLevels?.organic || 0}%` }}
                    ></div>
                  </div>

                  <div className="cluster-row">
                    <span>♻️ Plastic</span>
                    <span>{selectedBin.fillLevels?.plastic || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getFillLevel(selectedBin.fillLevels?.plastic || 0)}`}
                      style={{ width: `${selectedBin.fillLevels?.plastic || 0}%` }}
                    ></div>
                  </div>

                  <div className="cluster-row">
                    <span>🍶 Paper</span>
                    <span>{selectedBin.fillLevels?.paper || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getFillLevel(selectedBin.fillLevels?.paper || 0)}`}
                      style={{ width: `${selectedBin.fillLevels?.paper || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Bin Fill Legend */}
              <div className="bin-legend-card">
                <h4>Bin Fill Legend</h4>
                <div className="legend-item">
                  <span className="legend-dot low"></span>
                  <span>Low Fill Level</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot medium"></span>
                  <span>Medium Fill Level</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot high"></span>
                  <span>High Fill Level</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        .mapview-root {
          display: flex;
          height: 100vh;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background-color: #f5f5f5;
        }

        .mapview-sidebar {
          width: 260px;
          background-color: #28a745;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          padding: 20px 24px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          margin-bottom: 40px;
        }

        .logo-circle {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }

        .logo-letter {
          color: #28a745;
          font-weight: 800;
          font-size: 22px;
        }

        .sidebar-brand {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 22px;
          font-weight: 700;
        }

        .brand-subtitle {
          font-size: 11px;
          opacity: 0.9;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: inherit;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.18);
        }

        .nav-item-active {
          background-color: rgba(0, 0, 0, 0.25);
        }

        .nav-icon {
          font-size: 16px;
        }

        .sidebar-footer {
          margin-top: auto;
        }

        .logout-btn {
          border: none;
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .sidebar-copy {
          font-size: 11px;
          opacity: 0.9;
        }

        .mapview-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .mapview-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 28px;
          background-color: #28a745;
          color: #ffffff;
        }

        .topbar-title {
          font-size: 22px;
          font-weight: 600;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .topbar-search {
          display: flex;
          align-items: center;
          background-color: #ffffff;
          border-radius: 999px;
          padding: 6px 12px;
          min-width: 260px;
        }

        .search-icon {
          font-size: 14px;
          margin-right: 6px;
        }

        .search-input {
          border: none;
          outline: none;
          font-size: 14px;
          width: 100%;
        }

        .profile-avatar {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #28a745;
          font-weight: 600;
        }

        .mapview-map-wrapper {
          flex: 1;
          padding: 20px 26px 24px;
          background-color: #f5f5f5;
          display: flex;
          flex-direction: column;
        }

        .map-search-bar {
          max-width: 520px;
          background-color: #ffffff;
          border-radius: 999px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
          margin-bottom: 12px;
        }

        .map-search-bar input {
          border: none;
          outline: none;
          font-size: 14px;
          flex: 1;
        }

        .map-area {
          position: relative;
          flex: 1;
          min-height: 500px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-size: 16px;
          color: #666;
          background: #e8e8e8;
        }

        .bin-cluster-card {
          position: absolute;
          left: 20px;
          top: 20px;
          background-color: #ffffff;
          padding: 16px 18px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          width: 260px;
          z-index: 1000;
        }

        .close-btn {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          line-height: 1;
          padding: 0;
          width: 24px;
          height: 24px;
        }

        .close-btn:hover {
          color: #000;
        }

        .cluster-title {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 600;
        }

        .cluster-location {
          margin: 0 0 16px;
          font-size: 13px;
          color: #666666;
        }

        .cluster-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .progress-bar {
          height: 6px;
          background-color: #f0f0f0;
          border-radius: 999px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .progress-fill.high {
          background-color: #e53935;
        }

        .progress-fill.medium {
          background-color: #ffb300;
        }

        .progress-fill.low {
          background-color: #43a047;
        }

        .bin-legend-card {
          position: absolute;
          right: 20px;
          top: 20px;
          background-color: #ffffff;
          padding: 12px 16px;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
          min-width: 170px;
          font-size: 13px;
          z-index: 1000;
        }

        .bin-legend-card h4 {
          margin: 0 0 10px;
          font-size: 14px;
          font-weight: 600;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }

        .legend-dot.low {
          background-color: #43a047;
        }

        .legend-dot.medium {
          background-color: #ffb300;
        }

        .legend-dot.high {
          background-color: #e53935;
        }

        .custom-bin-icon {
          background: transparent;
          border: none;
        }

        /* Leaflet container fix */
        .leaflet-container {
          height: 100%;
          width: 100%;
        }

        @media (max-width: 900px) {
          .mapview-root {
            flex-direction: column;
          }

          .mapview-sidebar {
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .sidebar-nav {
            flex-direction: row;
          }

          .mapview-main {
            height: calc(100vh - 120px);
          }

          .bin-cluster-card {
            left: 10px;
            top: 10px;
            width: 220px;
          }

          .bin-legend-card {
            right: 10px;
            top: auto;
            bottom: 10px;
          }
        }
      `}</style>
    </>
  );
}