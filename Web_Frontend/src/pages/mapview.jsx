export default function MapView() {
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
                        <button className="nav-item">
                            <span className="nav-icon">📊</span>
                            <span>Dashboard Overview</span>
                        </button>

                        <button className="nav-item nav-item-active">
                            <span className="nav-icon">🗺️</span>
                            <span>Map View</span>
                        </button>

                        <button className="nav-item">
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
                            {/* Placeholder Google Maps iframe.
                  Replace src with your real Google Maps URL / integration later. */}
                            <iframe
                                title="Map"
                                className="map-iframe"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.868555560173!2d79.926!3d6.846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae250b1b8b1fd77%3A0x7e3e3d!2sMaharagama!5e0!3m2!1sen!2slk!4v1700000000000"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>

                            {/* Bin Cluster Card */}
                            <div className="bin-cluster-card">
                                <h3 className="cluster-title">Bin Cluster 101</h3>
                                <p className="cluster-location">Downtown Eco Plaza</p>

                                <div className="cluster-row">
                                    <span>Organic</span>
                                    <span>86%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill high"></div>
                                </div>

                                <div className="cluster-row">
                                    <span>Plastic</span>
                                    <span>68%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill medium"></div>
                                </div>

                                <div className="cluster-row">
                                    <span>Glass</span>
                                    <span>42%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill low"></div>
                                </div>
                            </div>

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

        .map-iframe {
          border: 0;
          width: 100%;
          height: 100%;
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
        }

        .progress-fill.high {
          width: 86%;
          background-color: #e53935;
        }

        .progress-fill.medium {
          width: 68%;
          background-color: #ffb300;
        }

        .progress-fill.low {
          width: 42%;
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

