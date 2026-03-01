import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
// This prevents the default marker icon from being broken
if (L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapView() {
  const navigate = useNavigate();
  const [selectedBin, setSelectedBin] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bins from MongoDB via API
  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bins");
        setBins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bins:", error);
        // Fallback to sample data if API fails
        setBins([
          {
            _id: "101",
            bin_id: "101",
            name: "Bin Cluster 101",
            location: "Downtown Eco Plaza",
            coordinates: { lat: 6.8792, lng: 79.8853 },
            fillLevels: { organic: 86, plastic: 68, glass: 42 }
          }
        ]);
        setLoading(false);
      }
    };
    fetchBins();
  }, []);

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
      getFillLevel(bin.fillLevels?.glass || 0)
    ];

    const colors = {
      low: "#43a047",
      medium: "#ffb300",
      high: "#e53935"
    };

    // Create SVG icon with colored dots
    const svgIcon = `
      <svg width="40" height="50" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C9 0 0 9 0 20c0 11 9 20 20 20s20-9 20-20C40 9 31 0 20 0z" fill="#28a745" stroke="#fff" stroke-width="2"/>
        <circle cx="20" cy="12" r="3" fill="${colors[dots[0]]}"/>
        <circle cx="20" cy="20" r="3" fill="${colors[dots[1]]}"/>
        <circle cx="20" cy="28" r="3" fill="${colors[dots[2]]}"/>
      </svg>
    `;

    return L.divIcon({
      className: "custom-bin-icon",
      html: svgIcon,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50]
    });
  };

  const handleBinClick = (bin) => {
    setSelectedBin(selectedBin?._id === bin._id ? null : bin);
  };

  // Default center (Maharagama, Sri Lanka)
  const defaultCenter = [6.8792, 79.8853];
  const defaultZoom = 14;

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
            <button className="nav-item" onClick={() => navigate('/dashboard')}>
              <span className="nav-icon">📊</span>
              <span>Dashboard Overview</span>
            </button>

            <button className="nav-item nav-item-active" onClick={() => navigate('/mapview')}>
              <span className="nav-icon">🗺️</span>
              <span>Map View</span>
            </button>

            <button className="nav-item" onClick={() => navigate('/settings')}>
              <span className="nav-icon">⚙️</span>
              <span>Settings or Legend</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn">Logout</button>
            <p className="sidebar-copy">© ENVOtix smart waste management</p>
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
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
              </div>

              <div className="profile-avatar">
                <span className="avatar-initial">A</span>
              </div>
            </div>
          </header>

          {/* Map Container */}
          <section className="mapview-map-wrapper">
            {/* Search box above map */}
            <div className="map-search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by location to view bin status"
              />
            </div>

            <div className="map-area">
              {loading ? (
                <div className="loading-spinner">Loading bins...</div>
              ) : (
                <MapContainer
                  center={defaultCenter}
                  zoom={defaultZoom}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

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
                          click: () => handleBinClick(bin)
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
                  <button
                    className="close-btn"
                    onClick={() => setSelectedBin(null)}
                  >
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
                    <span>🍶 Glass</span>
                    <span>{selectedBin.fillLevels?.glass || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getFillLevel(selectedBin.fillLevels?.glass || 0)}`}
                      style={{ width: `${selectedBin.fillLevels?.glass || 0}%` }}
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

      {/* Page-specific styles */}
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
          height: calc(100% - 40px);
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
        }

        .bin-cluster-card {
          position: absolute;
          left: 5%;
          top: 18%;
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
          right: 3%;
          top: 16%;
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
        }
      `}</style>
    </>
  );
}
