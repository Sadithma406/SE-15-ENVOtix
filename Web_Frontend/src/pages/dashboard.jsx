import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logoNoName.png";

export default function Dashboard() {
  const navigate = useNavigate();

  // State for raw database data
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // State for calculated analytics
  const [stats, setStats] = useState({
    total: 0,
    criticalOrganic: 0,
    criticalPlastic: 0,
    criticalPaper: 0,
    organicDonut: { high: 0, medium: 0, low: 0 },
    plasticDonut: { high: 0, medium: 0, low: 0 },
    paperDonut: { high: 0, medium: 0, low: 0 }
  });

  useEffect(() => {
    fetchBinData();
  }, []);

  const fetchBinData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/lanebins`);
      const data = response.data;
      setBins(data);
      calculateAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const calculateAnalytics = (allBins) => {
    const organicBins = allBins.filter(b => b.binType === "Organic");
    const plasticBins = allBins.filter(b => b.binType === "Plastic");
    const paperBins = allBins.filter(b => b.binType === "Paper");

    const getDonutData = (typeArray) => {
      const total = typeArray.length;
      if (total === 0) return { high: 0, medium: 0, low: 0 };
      const high = typeArray.filter(b => b.fillLevel >= 85).length;
      const medium = typeArray.filter(b => b.fillLevel >= 50 && b.fillLevel < 85).length;
      const low = typeArray.filter(b => b.fillLevel < 50).length;

      return {
        high: Math.round((high / total) * 100),
        medium: Math.round((medium / total) * 100),
        low: Math.round((low / total) * 100)
      };
    };

    setStats({
      total: allBins.length,
      criticalOrganic: organicBins.filter(b => b.fillLevel >= 85).length,
      criticalPlastic: plasticBins.filter(b => b.fillLevel >= 85).length,
      criticalPaper: paperBins.filter(b => b.fillLevel >= 85).length,
      organicDonut: getDonutData(organicBins),
      plasticDonut: getDonutData(plasticBins),
      paperDonut: getDonutData(paperBins)
    });
  };

  /* ========== DONUT CARD COMPONENT ========== */
  function DonutCard({ title, data }) {
    const { high, medium, low } = data;
    const highDeg = (high / 100) * 360;
    const mediumDeg = (medium / 100) * 360;

    return (
      <div className="donut-card">
        <div className="donut-title">{title}</div>
        <div className="donut-center-wrap">
          <div
            className="donut"
            style={{
              "--high": `${highDeg}deg`,
              "--medium": `${mediumDeg}deg`,
            }}
          >
            <div className="donut-center">{high}% <br />Critical</div>
          </div>
        </div>
        <div className="donut-legend-row">
          <span><span className="dot low"></span>Low</span>
          <span><span className="dot medium"></span>Medium</span>
          <span><span className="dot high"></span>High</span>
        </div>
        <div className="donut-values">
          High (≥85%): {high}% <br />
          Medium (50-84%): {medium}% <br />
          Low ({"<"}50%): {low}%
        </div>
      </div>
    );
  }

  /* ========== AREA WISE COMPONENT ========== */
  function AreaWiseFillLevels() {
    const data = [
      { province: "Colomno", organic: 60, plastic: 70, paper: 48 },
      { province: "City 1", organic: 0, plastic: 0, paper: 0 },
      { province: "City 2", organic: 0, plastic: 0, paper: 0 },
      { province: "City 3", organic: 0, plastic: 0, paper: 0 },
      { province: "City 4", organic: 0, plastic: 0, paper: 0 },
      { province: "City 5", organic: 0, plastic: 0, paper: 0 },
    ];
    const maxValue = Math.max(...data.flatMap((d) => [d.organic, d.plastic, d.paper]), 1);
    const barMaxHeight = 200;

    return (
      <div className="area-card">
        <h3>Area-Wise Fill Levels</h3>
        <span className="y-label">Bin count</span>
        <div className="chart">
          {data.map((row, i) => (
            <div key={i} className="group">
              <div className="bars-container">
                {["organic", "plastic", "paper"].map((type) => (
                  <div
                    key={type}
                    className={`bar ${type}`}
                    style={{ height: `${(row[type] / maxValue) * barMaxHeight}px` }}
                  >
                    <span>{row[type]}</span>
                  </div>
                ))}
              </div>
              <p className="province">{row.province}</p>
            </div>
          ))}
        </div>
        <div className="legend-vertical">
          <p><i className="lg organic"></i> Organic</p>
          <p><i className="lg plastic"></i> Plastic</p>
          <p><i className="lg paper"></i> Paper</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#28a745', fontWeight: 'bold' }}>Loading Analytics...</div>;
  }

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
            <div className="sidebar-brand">
              <div className="brand-title-wrap">
                <span className="brand-black">ENVO</span>
                <span className="brand-white">tix</span>
              </div>
              <span className="brand-subtitle">smart waste management</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item nav-item-active" onClick={() => navigate("/dashboard")}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate("/mapview")}>
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">Map View</span>
          </button>
          <button className="nav-item" onClick={() => navigate("/settings")}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => navigate("/")}>
            🚪 Logout
          </button>
          <p className="sidebar-copy">©️ ENVOtix smart waste management</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <h1 className="topbar-title">Waste Management Dashboard</h1>
          <div className="topbar-right">
            <button
              className="profile-avatar"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              A
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-info">
                  <p className="profile-name">
                    {(() => {
                      try { return JSON.parse(localStorage.getItem("user"))?.name || "Municipal Admin"; }
                      catch (e) { return "Municipal Admin"; }
                    })()}
                  </p>
                  <p className="profile-id" style={{ wordBreak: "break-all" }}>
                    {(() => {
                      try { return JSON.parse(localStorage.getItem("user"))?.email || "admin@munisipalcounsil.lk"; }
                      catch (e) { return "admin@munisipalcounsil.lk"; }
                    })()}
                  </p>
                </div>
                <button className="profile-logout-btn" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="dashboard-content-wrapper">
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Total Smart Bins</h3>
              <p className="card-value">{stats.total}</p>
            </div>
            <div className="dashboard-card warning">
              <h3>Critical Organic</h3>
              <p className="card-value">{stats.criticalOrganic}</p>
            </div>
            <div className="dashboard-card success">
              <h3>Critical Plastic</h3>
              <p className="card-value">{stats.criticalPlastic}</p>
            </div>
            <div className="dashboard-card danger">
              <h3>Critical Paper</h3>
              <p className="card-value">{stats.criticalPaper}</p>
            </div>
          </div>

          <h2 className="section-title">Collection Overview</h2>
          <div className="donut-cards-wrapper">
            <DonutCard title="Organic waste fill levels" data={stats.organicDonut} />
            <DonutCard title="Plastic waste fill levels" data={stats.plasticDonut} />
            <DonutCard title="Paper waste fill levels" data={stats.paperDonut} />
          </div>

          <AreaWiseFillLevels />
        </section>
      </main>

      <style>{`
        .dashboard-root {
          display: flex;
          height: 100vh;
          width: 100vw;
          font-family: 'Inter', system-ui, sans-serif;
          background: #28a745;
          overflow: hidden;
        }
        
        /* SIDEBAR STYLES */
        .dashboard-sidebar {
          width: 230px;
          background: #28a745;
          color: #fff;
          display: flex;
          flex-direction: column;
          padding: 20px;
          flex-shrink: 0;
        }

        .sidebar-header {
          margin-bottom: 40px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .brand-title-wrap {
          font-size: 22px;
          font-weight: 800;
          line-height: 1;
        }

        .brand-black {
          color: #000;
        }

        .brand-white {
          color: #fff;
        }

        .brand-subtitle {
          font-size: 11px;
          opacity: 0.9;
          display: block;
        }
        
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          border: none;
          background: rgba(255,255,255,0.1);
          color: white;
          padding: 15px;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          font-size: 17px;
          transition: max-width 0.4s ease, background 0.3s ease;
          max-width: 55px;
          overflow: hidden;
          white-space: nowrap;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.2);
          max-width: 100%;
        }

        .nav-item-active {
          background: rgba(0,0,0,0.3);
          font-weight: 700;
          border-left: 5px solid white;
          padding-left: 10px; /* account for border size */
        }

        .nav-icon {
          min-width: 25px;
          text-align: center;
          font-size: 20px;
        }

        .nav-text {
          margin-left: 15px;
          opacity: 0;
          transition: opacity 0.2s 0.1s ease;
        }

        .nav-item:hover .nav-text {
          opacity: 1;
        }
        
        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .logout-btn {
          border: none;
          background: rgba(255,255,255,0.15);
          color: white;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          text-align: left;
          transition: 0.3s;
        }

        .sidebar-copy {
          font-size: 11px;
          opacity: 0.8;
          margin: 0;
        }

        /* MAIN & TOPBAR */
        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .dashboard-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 28px;
          background: #28a745;
          color: #fff;
          flex-shrink: 0;
        }

        .topbar-title {
          font-size: 28px;
          margin: 0;
          font-weight: 600;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          position: relative;
        }

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
          z-index: 100;
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

        /* CONTENT STYLES */
        .dashboard-content-wrapper {
          padding: 25px;
          border-radius: 15px;
          background: #f8f9fa;
          flex: 1;
        }

        .section-title {
          font-size: 20px;
          color: #333;
          margin: 30px 0 15px 0;
        }

        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .dashboard-card {
          background: #fff;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border-top: 4px solid #28a745;
        }

        .dashboard-card.warning { border-top-color: #ffb300; }
        .dashboard-card.danger { border-top-color: #e53935; }

        .card-value {
          font-size: 32px;
          font-weight: 800;
          margin: 10px 0 0 0;
          color: #222;
        }
        
        .donut-cards-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .donut-card {
          background: #fff;
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .donut-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
          color: #444;
        }

        .donut-center-wrap {
          display: flex;
          justify-content: center;
        }

        .donut {
          position: relative;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center; 
          background: conic-gradient(#e53935 0deg var(--high), #203f4a var(--high) calc(var(--high) + var(--medium)), #43a047 calc(var(--high) + var(--medium)) 360deg);
        }

        .donut::after {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          background: #fff;
          border-radius: 50%;
        }

        .donut-center {
          position: relative;
          z-index: 2;
          font-size: 18px;
          font-weight: 800;
          text-align: center;
          line-height: 1.2;
        }
        
        .donut-legend-row {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 15px;
          font-size: 12px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot.low { background: #43a047; }
        .dot.medium { background: #203f4a; }
        .dot.high { background: #e53935; }

        .donut-values {
          margin-top: 15px;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }

        .area-card {
          margin-top: 30px;
          background: #fff;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        /* UPDATED CHART WITH VERTICAL LINES */
        .chart {
          height: 250px;
          display: flex;
          align-items: flex-end;
          gap: 15px;
          margin-top: 25px;
          border-bottom: 2px solid #eee;
          padding: 0 15px 10px 15px;
          overflow-x: auto;
          background-image: linear-gradient(to right, #f0f0f0 1px, transparent 1px);
          background-size: 95px 100%;
        }

        .group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
          z-index: 2;
        }

        .bars-container {
          display: flex;
          gap: 4px;
          align-items: flex-end;
        }

        .bar {
          width: 20px;
          border-radius: 4px 4px 0 0;
          position: relative;
          transition: 0.3s;
        }

        .bar span {
          position: absolute;
          top: -20px;
          width: 100%;
          text-align: center;
          font-size: 10px;
          font-weight: 700;
        }

        .bar.organic { background: #43a047; }
        .bar.plastic { background: #2fa395; }
        .bar.paper { background: #203f4a; }

        .province {
          font-size: 10px;
          font-weight: 600;
          text-align: center;
          margin-top: 10px;
          color: #666;
          height: 30px;
        }

        .legend-vertical {
          display: flex;
          justify-content: center;
          gap: 25px;
          margin-top: 20px;
        }

        .lg {
          width: 12px;
          height: 12px;
          display: inline-block;
          margin-right: 8px;
          border-radius: 3px;
        }

        .lg.organic { background: #43a047; }
        .lg.plastic { background: #2fa395; }
        .lg.paper { background: #203f4a; }

        .y-label {
          font-size: 11px;
          color: #888;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}