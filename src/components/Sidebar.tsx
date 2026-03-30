import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Views & Recommendations' },
        { path: '/ingestion', label: 'Data Ingestion' },
        { path: '/calculation', label: 'Carbon Calculator' },
        { path: '/hotspot', label: 'Hotspot Analysis' },
        { path: '/audit', label: 'Audit & Trust' },
        { path: '/recommendations', label: 'Mitigation Roadmap' },
    ];

    return (
        <aside className="sidebar" style={{ background: '#fff', boxShadow: '10px 0 30px rgba(0,0,0,0.02)' }}>
            <div className="sidebar-header" style={{ padding: '32px 24px', border: 'none' }}>
                <img src="/images/logo.jpeg" alt="ScopeZero" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(74,127,184,0.3)'
                }} />
                <span className="logo-text" style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    Scope<span style={{ color: 'var(--blue-primary)' }}>Zero</span>
                </span>
            </div>

            <nav className="sidebar-nav" style={{ padding: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', paddingLeft: '16px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Carbon Intelligence</div>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        style={{
                            display: 'block',
                            margin: '2px 0',
                            padding: '12px 16px',
                            transition: 'all 0.2s',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <span className="nav-label" style={{ fontWeight: location.pathname === item.path ? 700 : 500, fontSize: '14px' }}>
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer" style={{ padding: '24px', border: 'none' }}>
                <div className="user-profile" style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '16px', border: '1px solid var(--gray-100)' }}>
                    <div className="user-info">
                        <div className="user-name" style={{ fontWeight: 700, fontSize: '13px' }}>Carbon Tracker</div>
                        <div className="user-role" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>React App</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;