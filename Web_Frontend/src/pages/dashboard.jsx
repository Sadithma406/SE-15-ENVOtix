import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  /* ========== DONUT CARD ========== */
  function DonutCard({ title, high, medium, low }) {
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
            <div className="donut-center">{high}%</div>
          </div>
        </div>

        <div className="donut-legend-row">
          <span>
            <span className="dot low"></span>Low Fill
          </span>
          <span>
            <span className="dot medium"></span>Medium Fill
          </span>
          <span>
            <span className="dot high"></span>High Fill
          </span>
        </div>

        <div className="donut-values">
          High: {high}% <br />
          Medium: {medium}% <br />
          Low: {low}%
        </div>
      </div>
    );
  }

  /* ========== AREA WISE COMPONENT ========== */
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
          <p>
            <i className="lg organic"></i> Organic Waste
          </p>
          <p>
            <i className="lg plastic"></i> Plastic Waste
          </p>
          <p>
            <i className="lg glass"></i> Glass Waste
          </p>
        </div>
      </div>
    );
  }

  /* ========== MAIN RETURN ========== */
  return (
    <>
      <div className="dashboard-root">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
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
            <button
              className="nav-item nav-item-active"
              onClick={() => navigate("/dashboard")}
            >
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
            <p className="sidebar-copy">© ENVOtix smart waste management</p>
          </div>
        </aside>

        {/* MAIN */}
        <main className="dashboard-main">
          {/* TOPBAR */}
          <header className="dashboard-topbar">
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

          {/* CONTENT */}
          <section className="dashboard-content-wrapper">
            {/* TOP CARDS */}
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Total Smart Bins</h3>
                <p className="card-value">128</p>
              </div>
              <div className="dashboard-card warning">
                <h3>Bins Nearly Full</h3>
                <p className="card-value">34</p>
              </div>
              <div className="dashboard-card success">
                <h3>Active Zones</h3>
                <p className="card-value">12</p>
              </div>
              <div className="dashboard-card danger">
                <h3>Urgent Collections</h3>
                <p className="card-value">7</p>
              </div>
            </div>

            {/* COLLECTION OVERVIEW */}
            <h2>Collection Overview</h2>
            <div className="donut-cards-wrapper">
              <DonutCard title="Zone A Collection" high={88} medium={10} low={2} />
              <DonutCard title="Zone B Collection" high={65} medium={25} low={10} />
              <DonutCard title="Zone C Collection" high={32} medium={50} low={18} />
            </div>

            {/* AREA WISE FILL LEVELS */}
            <AreaWiseFillLevels />
          </section>
        </main>
      </div>

      {/* ========== INLINE CSS ========== */}
      <style>{`
        /* ======= LAYOUT ======= */
        .dashboard-root {
          display: flex;
          min-height: 100vh;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #f5f5f5;
        }

        /* ======= SIDEBAR ======= */
        .dashboard-sidebar {
          width: 260px;
          background: #28a745;
          color: #fff;
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
          border-radius: 50%;
          background: #fff;
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
          background: rgba(255, 255, 255, 0.18);
        }

        .nav-item-active {
          background: rgba(0, 0, 0, 0.25);
        }

        .sidebar-footer {
          margin-top: auto;
        }

        .logout-btn {
          border: none;
          background: transparent;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 6px;
        }

        .sidebar-copy {
          font-size: 11px;
          opacity: 0.9;
        }

        /* ======= MAIN ======= */
        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .dashboard-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 28px;
          background: #28a745;
          color: #fff;
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
          background: #fff;
          border-radius: 999px;
          padding: 6px 12px;
          min-width: 260px;
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
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #28a745;
          font-weight: 600;
        }

        /* ======= CARDS ======= */
        .dashboard-content-wrapper {
          padding: 28px;
        }

        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 28px;
          margin-bottom: 36px;
        }

        .dashboard-card {
          background: #fff;
          border-radius: 18px;
          padding: 26px;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
        }

        .dashboard-card h3 {
          margin: 0 0 12px;
          font-size: 18px;
        }

        .card-value {
          font-size: 38px;
          font-weight: 700;
        }

        /* ======= DONUT ======= */
        .donut-cards-wrapper {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 18px;
        }

        .donut-card {
          background: #fff;
          padding: 26px;
          border-radius: 16px;
        }

        .donut-title {
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .donut-center-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .donut {
          position: relative;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: conic-gradient(
            #f07b57 0deg var(--high),
            #2fa395 var(--high) calc(var(--high) + var(--medium)),
            #203f4a calc(var(--high) + var(--medium)) 360deg
          );
        }

        .donut::after {
          content: "";
          position: absolute;
          width: 118px;
          height: 118px;
          background: #fff;
          border-radius: 50%;
        }

        .donut-center {
          position: relative;
          z-index: 2;
          font-size: 26px;
          font-weight: 700;
          color: #333;
        }

        .donut-legend-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-top: 10px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
        }

        .dot.low {
          background: #203f4a;
        }

        .dot.medium {
          background: #2fa395;
        }

        .dot.high {
          background: #f07b57;
        }

        .donut-values {
          margin-top: 10px;
          font-size: 13px;
          color: #444;
          line-height: 1.6;
        }

        /* ======= AREA WISE ======= */
        .area-card {
          margin-top: 24px;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .area-card h3 {
          margin: 0 0 6px;
        }

        .y-label {
          font-size: 13px;
          font-weight: bold;
          color: #666;
        }

        .chart {
          height: 260px;
          display: flex;
          align-items: flex-end;
          gap: 22px;
          margin-top: 20px;
        }

        .group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bars-container {
          display: flex;
          gap: 6px;
          align-items: flex-end;
        }

        .bar {
          width: 30px;
          border-radius: 6px 6px 0 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .bar span {
          font-size: 12px;
          margin-bottom: 4px;
          color: #333;
        }

        .bar.organic {
          background: #57b65f;
        }

        .bar.plastic {
          background: #2fa395;
        }

        .bar.glass {
          background: #203f4a;
        }

        .province {
          text-align: center;
          font-size: 12px;
          color: #444;
          margin-top: 6px;
        }

        .legend-vertical {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 18px;
        }

        .legend-vertical p {
          font-size: 13px;
          margin: 0;
        }

        .lg {
          width: 10px;
          height: 10px;
          display: inline-block;
          margin-right: 6px;
          border-radius: 2px;
        }

        .lg.organic {
          background: #57b65f;
        }

        .lg.plastic {
          background: #2fa395;
        }

        .lg.glass {
          background: #203f4a;
        }
      `}</style>
    </>
  );
}