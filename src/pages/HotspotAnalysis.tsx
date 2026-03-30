import React from 'react';
import { useAppData } from '../context/DataContext';

const HotspotAnalysis: React.FC = () => {
    const { data } = useAppData();
    const lastUpdated = new Date(data.dataVersion).toLocaleString();
    const topSuppliersCount = Math.min(3, data.suppliers.length);
    const topSuppliersContribution = data.suppliers.slice(0, topSuppliersCount).reduce((acc, s) => acc + s.contribution, 0);

    // Derived region data
    const regionMap: Record<string, { emissions: number, count: number }> = {};
    data.rawRecords.forEach(r => {
        if (!regionMap[r.region]) regionMap[r.region] = { emissions: 0, count: 0 };
        regionMap[r.region].emissions += r.emissions;
        regionMap[r.region].count += 1;
    });

    const regions = Object.entries(regionMap).map(([name, val]) => ({
        name,
        emissions: Math.round(val.emissions),
        count: val.count,
        color: `hsl(${Math.random() * 360}, 60%, 45%)`
    })).sort((a, b) => b.emissions - a.emissions);

    return (
        <div className="page-wrapper fade-in" style={{ paddingTop: '0' }}>
            <div className="page-header">
                <h1 className="page-title">Hotspot Intelligence</h1>
            </div>

            <div className="grid-2" style={{ gap: '32px' }}>
                <div className="card">
                    <h3 className="card-header">Critical Supplier Contributors</h3>
                    <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Pareto Analysis Result</div>
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {data.suppliers.length > 0
                                ? `Top ${topSuppliersCount} suppliers account for ${topSuppliersContribution}% of total Scope 3 footprint (${data.rawRecords.length} records analyzed).`
                                : "No supplier data available. Please upload a dataset to identify hotspots."}
                        </p>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ padding: '12px' }}>Entity</th>
                                <th>Emissions</th>
                                <th style={{ textAlign: 'right' }}>Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.suppliers.slice(0, 8).map((s, i) => (
                                <tr key={i} className="hover-light">
                                    <td style={{ padding: '12px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{s.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.region}</div>
                                        </div>
                                    </td>
                                    <td><span style={{ fontWeight: 700 }}>{s.emissions.toLocaleString()}</span> <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>tCO2e</span></td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="badge badge-yellow" style={{ minWidth: '60px', fontWeight: 800 }}>{s.contribution}%</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3 className="card-header">Material Lifecycle Intensity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px 0' }}>
                        {data.materials.map((m, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-end' }}>
                                    <div>
                                        <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>{m.name}</span>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Material Class</div>
                                    </div>
                                    <span style={{ fontWeight: 800, color: m.color, fontSize: '16px' }}>{m.percentage}%</span>
                                </div>
                                <div className="progress-bar" style={{ height: '10px', borderRadius: '5px', background: 'var(--gray-100)', overflow: 'hidden' }}>
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${m.percentage}%`,
                                            backgroundColor: m.color,
                                            boxShadow: `0 0 15px ${m.color}66`,
                                            borderRadius: '5px'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {data.materials.length > 0 && (
                        <div style={{ marginTop: '32px', padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--gray-50) 100%)', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Strategic Insight</div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{data.materials[0].name} represents {data.materials[0].percentage}% of emissions. Implementing recycling could potentially offset {Math.round(data.materials[0].percentage * 0.4)}% of total footprint.</div>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3 className="card-header">Logistics Lane Efficiency</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.transportModes.map((mode, i) => {
                            const maxVal = Math.max(...data.transportModes.map(m => m.value), 1);
                            const getVehicleImage = (transportMode: string) => {
                                if (transportMode.toLowerCase().includes('truck')) return '/images/truck.jpeg';
                                if (transportMode.toLowerCase().includes('ship') || transportMode.toLowerCase().includes('cargo')) return '/images/ship.jpeg';
                                if (transportMode.toLowerCase().includes('air') || transportMode.toLowerCase().includes('flight')) return '/images/flight.jpeg';
                                if (transportMode.toLowerCase().includes('rail') || transportMode.toLowerCase().includes('train')) return '/images/train.jpeg';
                                if (transportMode.toLowerCase().includes('car')) return '/images/car.jpeg';
                                return '/images/truck.jpeg';
                            };
                            // Calculate emissions per ton-km for this mode
                            const modeRecords = data.rawRecords.filter(r => r.transportMode === mode.mode);
                            const totalTonKm = modeRecords.reduce((sum, r) => sum + (r.weight * r.distance / 1000), 0);
                            const emissionsPerTonKm = totalTonKm > 0 ? (mode.value / totalTonKm).toFixed(3) : '0.000';
                            
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)', transition: 'transform 0.2s' }} className="hover-card">
                                    <img src={getVehicleImage(mode.mode)} alt={mode.mode} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>{mode.mode}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{emissionsPerTonKm} kgCO2e/ton-km calculated</div>
                                        <div className="progress-bar" style={{ height: '6px', width: '90%', background: 'var(--gray-200)' }}>
                                            <div className="progress-fill" style={{ width: `${(mode.value / maxVal) * 100}%`, backgroundColor: mode.color, borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: '18px' }}>{mode.value.toLocaleString()}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>kgCO2e</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">Regional Attribution</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {regions.length > 0 ? regions.map((r, i) => (
                            <div key={i} style={{ padding: '20px', borderRadius: '20px', background: '#fff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, fontSize: '16px' }}>{r.name}</span>
                                    <div style={{ padding: '4px 12px', borderRadius: '20px', background: r.color + '22', color: r.color, fontSize: '11px', fontWeight: 800 }}>{r.count} DATA ENTRIES</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{r.emissions.toLocaleString()}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>tCO2e TOTAL</div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No regional data identified.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotspotAnalysis;
