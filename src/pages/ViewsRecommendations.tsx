import React, { useState } from 'react';
import { useAppData } from '../context/DataContext';

const ViewsRecommendations: React.FC = () => {
    const { data } = useAppData();
    const [scenario, setScenario] = useState<'current' | 'optimized'>('current');

    const topSupplier = data.suppliers[0] || { name: 'No data', contribution: 0 };
    const topMaterial = data.materials[0] || { name: 'No data', percentage: 0 };
    const topTransport = data.transportModes[0] || { mode: 'No data', value: 0 };
    const lastUpdated = new Date(data.dataVersion).toLocaleString();
    const categoryTotal = data.categoryBreakdown.reduce((sum, cat) => sum + cat.percentage, 0);

    const kpis = [
        { title: 'Total Scope 3', value: data.totalEmissions.toLocaleString(), unit: 'kgCO2e', status: 'blue' },
        { title: 'Largest Hotspot', value: topSupplier.name, unit: `${topSupplier.contribution}% Contribution`, status: 'yellow' },
        { title: 'Reduction Potential', value: data.potentialReduction.toLocaleString(), unit: 'kgCO2e', status: 'green' },
        { title: 'Mitigation Actions', value: data.recommendations.length, unit: 'Rule-based strategies', status: 'blue' },
    ];

    const savingsPercentage = data.totalEmissions > 0 ? Math.round((data.potentialReduction / data.totalEmissions) * 1000) / 10 : 0;

    return (
        <div className="page-wrapper fade-in" style={{ paddingTop: '0' }}>
            <div className="page-header">
                <h1 className="page-title">Views & Recommendations</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid-4" style={{ marginBottom: '40px' }}>
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="card stat-card" style={{ cursor: 'pointer', border: 'none', background: '#fff', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                            <span className={`badge badge-${kpi.status}`} style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>Live</span>
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>{kpi.value}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {kpi.title} <div style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '11px', marginTop: '2px' }}>{kpi.unit}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ gap: '32px', marginBottom: '32px' }}>
                {/* Emissions Split */}
                <div className="card">
                    <h3 className="card-header">Emissions Split by Category</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '48px', padding: '20px 0' }}>
                        <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.05))' }}>
                                {data.categoryBreakdown.map((cat, i) => {
                                    let offset = 0;
                                    for (let j = 0; j < i; j++) offset += data.categoryBreakdown[j].percentage;
                                    return (
                                        <circle
                                            key={i}
                                            cx="18" cy="18" r="15.9"
                                            fill="transparent"
                                            stroke={cat.color}
                                            strokeWidth="3.2"
                                            strokeDasharray={`${cat.percentage} ${100 - cat.percentage}`}
                                            strokeDashoffset={-offset}
                                            style={{ transition: 'all 1s ease' }}
                                        />
                                    );
                                })}
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total</div>
                                <div style={{ fontSize: '24px', fontWeight: 800 }}>{categoryTotal}%</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {data.categoryBreakdown.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px', borderRadius: '12px', transition: 'all 0.2s', cursor: 'pointer' }} className="hover-light">
                                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}44` }}></div>
                                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{item.name}</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Risk Hotspots */}
                <div className="card">
                    <h3 className="card-header">Primary Risk Hotspots</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
                        {[
                            { label: 'Risk Entity', value: topSupplier.name, sub: `${topSupplier.contribution}% of total footprint`, color: 'yellow', threshold: topSupplier.contribution >= 10 },
                            { label: 'Resource Intensity', value: topMaterial.name, sub: `${topMaterial.percentage}% material share`, color: 'blue', threshold: topMaterial.percentage >= 10 },
                            { label: 'Logistics Volatility', value: topTransport.mode, sub: `${topTransport.value.toLocaleString()} kgCO2e logged`, color: 'green', threshold: topTransport.value >= 1000 }
                        ].map((hotspot, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{hotspot.label}</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{hotspot.value}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hotspot.sub}</div>
                                </div>
                                {hotspot.threshold && (
                                    <span className={`badge badge-${hotspot.color}`} style={{ fontWeight: 800, minWidth: '100px', textAlign: 'center' }}>IDENTIFIED</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ gap: '32px', marginBottom: '32px' }}>
                {/* Strategic Reduction Potential */}
                <div className="card" style={{ background: 'linear-gradient(135deg, white 0%, var(--gray-50) 100%)' }}>
                    <h3 className="card-header">Strategic Reduction Potential</h3>
                    <div style={{ padding: '8px 4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Aggregated Savings</div>
                                <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--green-primary)', fontFamily: 'var(--font-heading)' }}>
                                    −{data.potentialReduction.toLocaleString()} <span style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>kgCO2e</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>{savingsPercentage}%</div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Net Footprint Reduction</div>
                            </div>
                        </div>
                        <div className="progress-bar" style={{ height: '16px', borderRadius: '8px', background: 'var(--gray-100)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                            <div className="progress-fill progress-fill-gradient" style={{ width: `${Math.min(savingsPercentage * 2, 100)}%`, height: '100%', borderRadius: '8px' }}></div>
                        </div>
                    </div>
                </div>

                {/* Mitigation Scenario Simulator */}
                <div className="card">
                    <h3 className="card-header">Mitigation Scenario Simulator</h3>
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ background: 'var(--gray-100)', padding: '6px', borderRadius: '14px', display: 'inline-flex', gap: '4px', border: '1px solid var(--border-color)' }}>
                            <button
                                onClick={() => setScenario('current')}
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: scenario === 'current' ? '#fff' : 'transparent',
                                    boxShadow: scenario === 'current' ? 'var(--shadow-md)' : 'none',
                                    color: scenario === 'current' ? 'var(--text-primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Baseline Environment
                            </button>
                            <button
                                onClick={() => setScenario('optimized')}
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: scenario === 'optimized' ? '#fff' : 'transparent',
                                    boxShadow: scenario === 'optimized' ? 'var(--shadow-md)' : 'none',
                                    color: scenario === 'optimized' ? 'var(--blue-primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Optimized Forecast
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px' }}>
                        <div style={{ flex: 1, textAlign: 'center', padding: '20px', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Footprint</div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: scenario === 'optimized' ? 'var(--green-primary)' : 'var(--text-primary)', fontFamily: 'var(--font-heading)', transition: 'color 0.4s' }}>
                                {scenario === 'current' ? data.totalEmissions.toLocaleString() : (data.totalEmissions - data.potentialReduction).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>kgCO2e / Annum</div>
                        </div>
                        <div style={{ fontSize: '24px', color: 'var(--gray-300)', fontWeight: 300 }}>→</div>
                        <div style={{ flex: 1, textAlign: 'center', padding: '20px', borderRadius: '16px', background: 'var(--blue-light)', border: '1px solid var(--blue-primary)22' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--blue-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>Projected Savings</div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--blue-primary)', fontFamily: 'var(--font-heading)' }}>
                                {scenario === 'current' ? '$0' : (data.potentialReduction * 0.15).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--blue-primary)' }}>Est. OPEX Alpha</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* High-Priority Mitigations */}
            <div className="card">
                <h3 className="card-header">High-Priority Mitigations</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>Rule-based mitigation strategies derived from dataset analysis</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {data.recommendations.length > 0 ? data.recommendations.map((rec, i) => {
                        const triggerCondition = rec.title.includes('Steel') ? `Steel >${Math.round((data.materials.find(m => m.name === 'Steel')?.percentage || 0))}% of footprint` : 
                                                rec.title.includes('Ocean') ? 'Air transport detected in dataset' : 'Material optimization opportunity';
                        return (
                            <div key={i} style={{ display: 'flex', gap: '20px', padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '20px', border: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="hover-card">
                                <div style={{ width: '90px', height: '90px', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', fontSize: '32px' }}>
                                    {rec.title.includes('Logistics') || rec.title.includes('Sea') ? '🚢' : '♻️'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px', color: 'var(--text-primary)' }}>{rec.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Trigger: {triggerCondition}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{rec.description}</div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                        <span className="badge badge-green" style={{ background: 'var(--green-light)', color: 'var(--green-primary)', border: 'none' }}>−{rec.emissions.toLocaleString()} kgCO2e</span>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>ROI: {rec.savings} (Assumed)</span>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No mitigation opportunities identified from current dataset.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewsRecommendations;