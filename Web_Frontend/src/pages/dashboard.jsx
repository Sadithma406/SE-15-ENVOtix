import React, { useEffect, useState } from "react";

const REFRESH_INTERVAL = 10000;

export default function Dashboard() {
  const [areaData, setAreaData] = useState([]);
  const [summary, setSummary] = useState({
    totalBins: 0,
    criticalOrganic: 0,
    criticalPlastic: 0,
    criticalGlass: 0
  });

  const getLevel = (value) => {
    if (value <= 40) return "Low";
    if (value <= 70) return "Medium";
    return "High";
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = () => {
    const apiResponse = {
      summary: {
        totalBins: 1280,
        criticalOrganic: 45,
        criticalPlastic: 22,
        criticalGlass: 18
      },
      areas: [
        { province: "Central", organic: 78, plastic: 45, glass: 90 },
        { province: "North Central", organic: 55, plastic: 82, glass: 30 },
        { province: "Southern", organic: 90, plastic: 40, glass: 35 },
        { province: "Eastern", organic: 60, plastic: 65, glass: 72 },
        { province: "Western", organic: 35, plastic: 88, glass: 79 },
        { province: "Uva", organic: 70, plastic: 50, glass: 45 }
      ]
    };

    setSummary(apiResponse.summary);
    setAreaData(apiResponse.areas);
  };

  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2 className="logo">ENVotix</h2>
          <ul className="menu">
            <li className="active">Dashboard Overview</li>
            <li>Map View</li>
            <li>Settings / Legend</li>
          </ul>
          <button className="logout">Logout</button>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <h1>Waste Management Dashboard</h1>
            <input type="text" placeholder="Search..." />
          </header>

          <section className="cards">
            <SummaryCard title="Total Bins Registered" value={summary.totalBins} />
            <SummaryCard title="Critical Organic Bins" value={summary.criticalOrganic} danger />
            <SummaryCard title="Critical Plastic Bins" value={summary.criticalPlastic} danger />
            <SummaryCard title="Critical Glass/Water Bins" value={summary.criticalGlass} danger />
          </section>

          <section className="analysis-section">
            <h2>Area-Wise Fill Level Analysis</h2>
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>Province</th>
                  <th>Organic %</th>
                  <th>Status</th>
                  <th>Plastic %</th>
                  <th>Status</th>
                  <th>Glass %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {areaData.map((area, index) => (
                  <tr key={index}>
                    <td>{area.province}</td>
                    <td>{area.organic}</td>
                    <td className={getLevel(area.organic)}>{getLevel(area.organic)}</td>
                    <td>{area.plastic}</td>
                    <td className={getLevel(area.plastic)}>{getLevel(area.plastic)}</td>
                    <td>{area.glass}</td>
                    <td className={getLevel(area.glass)}>{getLevel(area.glass)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      {/* ✅ CSS MUST be inside return */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Segoe UI, Arial; }
        body { background: #f4f6f8; }
        .dashboard-container { display: flex; min-height: 100vh; }
        .sidebar { width: 240px; background: #63b35d; color: #fff; padding: 20px; display: flex; flex-direction: column; }
        .logo { font-size: 22px; margin-bottom: 30px; }
        .menu { list-style: none; flex: 1; }
        .menu li { padding: 12px; border-radius: 6px; cursor: pointer; }
        .menu .active { background: rgba(255,255,255,0.25); }
        .logout { background: none; border: none; color: white; cursor: pointer; }
        .main-content { flex: 1; padding: 25px; }
        .topbar { background: #63b35d; color: white; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; }
        .cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; margin: 25px 0; }
        .card { background: white; padding: 18px; border-radius: 10px; }
        .card.danger h2 { color: #e74c3c; }
        .analysis-section { background: white; padding: 20px; border-radius: 10px; }
        .analysis-table { width: 100%; border-collapse: collapse; }
        .analysis-table th, .analysis-table td { padding: 12px; border-bottom: 1px solid #ddd; }
        .Low { color: #27ae60; font-weight: 600; }
        .Medium { color: #f39c12; font-weight: 600; }
        .High { color: #e74c3c; font-weight: 600; }
      `}</style>
    </>
  );
}

function SummaryCard({ title, value, danger }) {
  return (
    <div className={`card ${danger ? "danger" : ""}`}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}