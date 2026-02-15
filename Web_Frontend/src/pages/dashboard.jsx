import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State for raw database data
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for calculated analytics
  const [stats, setStats] = useState({
    total: 0,
    criticalOrganic: 0,
    criticalPlastic: 0,
    criticalGlass: 0,
    organicDonut: { high: 0, medium: 0, low: 0 },
    plasticDonut: { high: 0, medium: 0, low: 0 },
    glassDonut: { high: 0, medium: 0, low: 0 }
  });

  useEffect(() => {
    fetchBinData();
  }, []);

  const fetchBinData = async () => {
    try {
      // Ensure your backend is running on port 5000
      const response = await axios.get("http://localhost:5000/api/lanebins");
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
    // 1. Filter bins by type
    const organicBins = allBins.filter(b => b.binType === "Organic");
    const plasticBins = allBins.filter(b => b.binType === "Plastic");
    const glassBins = allBins.filter(b => b.binType === "Glass");

    // 2. Helper to calculate donut percentages
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
      criticalGlass: glassBins.filter(b => b.fillLevel >= 85).length,
      organicDonut: getDonutData(organicBins),
      plasticDonut: getDonutData(plasticBins),
      glassDonut: getDonutData(glassBins)
    });
  };

  /* ========== DONUT CARD COMPONENT ========== */
  function DonutCard({ title, data }) {
    const { high, medium, low } = data;
    // Calculate degrees for CSS conic-gradient
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
          Low (≥50%): {low}%
        </div>
      </div>
    );
  }

  /* ========== AREA WISE COMPONENT (Placeholder) ========== */
  function AreaWiseFillLevels() {
    const data = [
      { province: "Central Province", organic: 120, plastic: 80, glass: 48 },
      { province: "North Central Province", organic: 65, plastic: 105, glass: 70 },
      { province: "Southern Province", organic: 140, plastic: 60, glass: 40 },
      { province: "Eastern Province", organic: 100, plastic: 90, glass: 68 },
      { province: "Western Province", organic: 85, plastic: 110, glass: 75 },
      { province: "Uva Province", organic: 110, plastic: 65, glass: 42 },
    ];

    const maxValue = Math.max(...data.flatMap((d) => [d.organic, d.plastic, d.glass]));
    const barMaxHeight = 200;

    return (
      <div className="area-card">
        <h3>Area-Wise Fill Levels</h3>
        <span className="y-label">Bin count</span>
        <div className="chart">
          {data.map((row, i) => (
            <div key={i} className="group">
              <div className="bars-container">
                {["organic", "plastic", "glass"].map((type) => (
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
          <p><i className="lg glass"></i> Glass</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading Analytics...</div>;
  }

  return (
    <>
      <div className="dashboard-root">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="logo-circle"><span className="logo-letter">E</span></div>
            <div className="sidebar-brand">
              <span className="brand-title">ENVOtix</span>
              <span className="brand-subtitle">smart waste management</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button className="nav-item nav-item-active" onClick={() => navigate("/dashboard")}>
              <span className="nav-icon">📊</span>
              <span>Dashboard Overview</span>
            </button>
            <button className="nav-item" onClick={() => navigate("/mapview")}>
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

        {/* MAIN */}
        <main className="dashboard-main">
          <header className="dashboard-topbar">
            <h1 className="topbar-title">Waste Management Dashboard</h1>
            <div className="topbar-right">
              <div className="topbar-search">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search..." className="search-input" />
              </div>
              <div className="profile-avatar"><span className="avatar-initial">A</span></div>
            </div>
          </header>

          <section className="dashboard-content-wrapper">
            {/* TOP CARDS - DYNAMIC DATA */}
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Total Smart Bins</h3>
                <p className="card-value">{stats.total}</p>
              </div>
              <div className="dashboard-card warning">
                <h3>Critical Organic Bins</h3>
                <p className="card-value">{stats.criticalOrganic}</p>
              </div>
              <div className="dashboard-card success">
                <h3>Critical Plastic Bins</h3>
                <p className="card-value">{stats.criticalPlastic}</p>
              </div>
              <div className="dashboard-card danger">
                <h3>Critical Glass Bins</h3>
                <p className="card-value">{stats.criticalGlass}</p>
              </div>
            </div>

            <h2>Collection Overview</h2>
            <div className="donut-cards-wrapper">
              <DonutCard title="Organic waste fill levels" data={stats.organicDonut} />
              <DonutCard title="Plastic waste fill levels" data={stats.plasticDonut} />
              <DonutCard title="Glass waste fill levels" data={stats.glassDonut} />
            </div>

            <AreaWiseFillLevels />
          </section>
        </main>
      </div>

      <style>{`
        /* Keep your existing CSS exactly as it was provided */
        .dashboard-root { display: flex; min-height: 100vh; font-family: sans-serif; background: #f5f5f5; }
        .dashboard-sidebar { width: 260px; background: #28a745; color: #fff; display: flex; flex-direction: column; padding: 20px 24px; }
        .sidebar-header { display: flex; align-items: center; margin-bottom: 40px; }
        .logo-circle { width: 42px; height: 42px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; margin-right: 10px; }
        .logo-letter { color: #28a745; font-weight: 800; font-size: 22px; }
        .sidebar-brand { display: flex; flex-direction: column; }
        .brand-title { font-size: 22px; font-weight: 700; }
        .brand-subtitle { font-size: 11px; opacity: 0.9; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 6px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 999px; border: none; background: transparent; color: inherit; font-size: 14px; cursor: pointer; text-align: left; }
        .nav-item-active { background: rgba(0, 0, 0, 0.25); }
        .sidebar-footer { margin-top: auto; }
        .logout-btn { border: none; background: transparent; color: #fff; font-size: 14px; cursor: pointer; }
        .dashboard-main { flex: 1; display: flex; flex-direction: column; }
        .dashboard-topbar { display: flex; justify-content: space-between; align-items: center; padding: 18px 28px; background: #28a745; color: #fff; }
        .topbar-title {
          font-size: 22px;
          font-weight: 600;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .topbar-search { display: flex; align-items: center; background: #fff; border-radius: 999px; padding: 6px 12px; min-width: 260px; }
        .search-input { border: none; outline: none; font-size: 14px; width: 100%; }
        .profile-avatar { width: 34px; height: 34px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; color: #28a745; font-weight: 600; }
        .dashboard-content-wrapper { padding: 28px; }
        .dashboard-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 28px; margin-bottom: 36px; }
        .dashboard-card { background: #fff; border-radius: 18px; padding: 26px; box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16); }
        .card-value { font-size: 38px; font-weight: 700; }
        .donut-cards-wrapper { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 18px; }
        .donut-card { background: #fff; padding: 26px; border-radius: 16px; }
        .donut-title { font-size: 17px; font-weight: 600; margin-bottom: 18px; }
        .donut-center-wrap { display: flex; justify-content: center; margin-bottom: 10px; }
        .donut { position: relative; width: 170px; height: 170px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: conic-gradient(#f07b57 0deg var(--high), #203f4a var(--high) calc(var(--high) + var(--medium)), #2fa395 calc(var(--high) + var(--medium)) 360deg); }
        .donut::after { content: ""; position: absolute; width: 118px; height: 118px; background: #fff; border-radius: 50%; }
        .donut-center { position: relative; z-index: 2; font-size: 20px; font-weight: 700; color: #333; }
        .donut-legend-row { display: flex; justify-content: space-between; font-size: 11px; margin-top: 10px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .dot.low { background: #2fa395; }
        .dot.medium { background: #203f4a }
        .dot.high { background: #f07b57; }
        .donut-values { margin-top: 10px; font-size: 12px; color: #444; }
        .area-card { margin-top: 24px; background: #fff; padding: 20px; border-radius: 12px; }
        .chart { height: 260px; display: flex; align-items: flex-end; gap: 22px; margin-top: 20px; }
        .group { flex: 1; display: flex; flex-direction: column; align-items: center; }
        .bars-container { display: flex; gap: 6px; align-items: flex-end; }
        .bar { width: 30px; border-radius: 6px 6px 0 0; display: flex; align-items: flex-end; justify-content: center; }
        .bar span { font-size: 10px; margin-bottom: 4px; }
        .bar.organic { background: #57b65f; }
        .bar.plastic { background: #2fa395; }
        .bar.glass { background: #203f4a; }
        .province { text-align: center; font-size: 10px; margin-top: 6px; }
        .legend-vertical { display: flex; justify-content: center; gap: 20px; margin-top: 18px; }
        .lg { width: 10px; height: 10px; display: inline-block; margin-right: 6px; border-radius: 2px; }
        .lg.organic { background: #57b65f; }
        .lg.plastic { background: #2fa395; }
        .lg.glass { background: #203f4a; }
      `}</style>
    </>
  );
}