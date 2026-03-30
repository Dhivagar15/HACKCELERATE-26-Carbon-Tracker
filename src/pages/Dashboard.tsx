import React, { useState, useEffect } from 'react';
import { mockApiService, DashboardData } from '../services/mockApi';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockApiService.getDashboard().then(dashboardData => {
            setData(dashboardData);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!data) {
        return <div style={{ padding: '48px', textAlign: 'center' }}>No data available</div>;
    }

    return (
        <div className="page-wrapper" style={{ padding: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px' }}>Carbon Dashboard</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Total Emissions Card */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Total Emissions</h3>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--blue-primary)' }}>
                        {data.totalEmissions.toLocaleString()} kg CO₂e
                    </div>
                </div>

                {/* Top Suppliers */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Top Suppliers</h3>
                    {data.suppliers.map((supplier, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 500 }}>{supplier.name}</span>
                            <span style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
                                {supplier.emissions.toLocaleString()} kg ({supplier.contribution}%)
                            </span>
                        </div>
                    ))}
                </div>

                {/* Materials Breakdown */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Materials</h3>
                    {data.materials.map((material, index) => (
                        <div key={index} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 500 }}>{material.name}</span>
                                <span style={{ fontWeight: 700 }}>{material.percentage}%</span>
                            </div>
                            <div style={{ 
                                width: '100%', 
                                height: '8px', 
                                background: '#f0f0f0', 
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{ 
                                    width: `${material.percentage}%`, 
                                    height: '100%', 
                                    background: 'var(--blue-primary)',
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Transport Modes */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Transport Modes</h3>
                    {data.transportModes.map((transport, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 500 }}>{transport.mode}</span>
                            <span style={{ fontWeight: 700, color: 'var(--green-primary)' }}>
                                {transport.value.toLocaleString()} kg
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;