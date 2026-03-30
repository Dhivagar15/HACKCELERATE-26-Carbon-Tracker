import React, { useState } from 'react';
import { useAppData } from '../context/DataContext';

const Recommendations: React.FC = () => {
    const { data } = useAppData();
    const [scenario, setScenario] = useState<'current' | 'optimized'>('current');

    const savingsPercentage = data.totalEmissions > 0 ? Math.round((data.potentialReduction / data.totalEmissions) * 1000) / 10 : 0;

    return (
        <div className="page-wrapper fade-in" style={{ paddingTop: '0' }}>
            <div className="page-header">
                <h1 className="page-title">Mitigation Roadmap</h1>
            </div>

            <div className="grid-2" style={{ gap: '32px' }}>
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
                        <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: '#fff', border: '1px solid var(--border-color)' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong style={{ color: 'var(--text-primary)' }}>Mitigation Forecast:</strong> By implementing the AI-generated optimizations, you can achieve substantial reductions in Scope 3 intensity.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">High-Priority Mitigations</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.recommendations.length > 0 ? data.recommendations.map((rec, i) => (
                            <div key={i} style={{ display: 'flex', gap: '20px', padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '20px', border: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="hover-card">
                                <div style={{ width: '90px', height: '90px', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', fontSize: '32px' }}>
                                    {rec.title.includes('Logistics') || rec.title.includes('Sea') ? '🚢' : '♻️'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px', color: 'var(--text-primary)' }}>{rec.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{rec.description}</div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                        <span className="badge badge-green" style={{ background: 'var(--green-light)', color: 'var(--green-primary)', border: 'none' }}>−{rec.emissions.toLocaleString()} kgCO2e</span>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>ROI: {rec.savings}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No mitigation opportunities identified.</div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">Mitigation Scenario Simulator</h3>
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ background: 'var(--gray-100)', padding: '6px', borderRadius: '14px', display: 'inline-flex', gap: '4px', border: '1px solid var(--border-color)' }}>
                            <button
                                onClick={() => setScenario('current')}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: scenario === 'current' ? '#fff' : 'transparent',
                                    boxShadow: scenario === 'current' ? 'var(--shadow-md)' : 'none',
                                    color: scenario === 'current' ? 'var(--text-primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Baseline Environment
                            </button>
                            <button
                                onClick={() => setScenario('optimized')}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: scenario === 'optimized' ? '#fff' : 'transparent',
                                    boxShadow: scenario === 'optimized' ? 'var(--shadow-md)' : 'none',
                                    color: scenario === 'optimized' ? 'var(--blue-primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Optimized Forecast
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '32px', padding: '10px' }}>
                        <div style={{ textAlign: 'center', padding: '24px', borderRadius: '24px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Footprint</div>
                            <div style={{ fontSize: '36px', fontWeight: 800, color: scenario === 'optimized' ? 'var(--green-primary)' : 'var(--text-primary)', fontFamily: 'var(--font-heading)', transition: 'color 0.4s' }}>
                                {scenario === 'current' ? data.totalEmissions.toLocaleString() : (data.totalEmissions - data.potentialReduction).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>kgCO2e / Annum</div>
                        </div>
                        <div style={{ fontSize: '32px', color: 'var(--gray-300)', fontWeight: 300 }}>→</div>
                        <div style={{ textAlign: 'center', padding: '24px', borderRadius: '24px', background: 'var(--blue-light)', border: '1px solid var(--blue-primary)22' }}>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>Projected Savings</div>
                            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--blue-primary)', fontFamily: 'var(--font-heading)' }}>
                                {scenario === 'current' ? '$0' : (data.potentialReduction * 0.15).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--blue-primary)' }}>Est. OPEX Alpha</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">Impact Ranking Logic</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {data.recommendations.map((item, i) => (
                            <div key={i} style={{ padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--text-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>{i + 1}</span>
                                        <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)' }}>{item.title}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>CONFIDENCE</div>
                                        <span style={{ fontWeight: 800, color: 'var(--blue-primary)', fontSize: '18px' }}>94%</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '32px', padding: '16px', borderRadius: '14px', background: 'var(--bg-tertiary)' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Environmental Impact</div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>High</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Feasibility</div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Standard</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
