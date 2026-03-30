import React, { useState } from 'react';
import { useAppData } from '../context/DataContext';

const CarbonCalculation: React.FC = () => {
    const { data } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const lastUpdated = new Date(data.dataVersion).toLocaleString();
    const sampleRecord = data.rawRecords[0] || { weight: 0, emissions: 0, material: 'N/A', transportMode: 'N/A' };
    const emissionFactor = sampleRecord.weight > 0 ? (sampleRecord.emissions / sampleRecord.weight).toFixed(3) : '0.000';
    
    const factors = [
        { name: 'Primary Steel (HBR)', category: 'Materials', region: 'Global', factor: 1.85, unit: 'kg CO2/kg', confidence: 'High', source: 'Ecoinvent 3.10' },
        { name: 'Air Freight (Long Haul)', category: 'Transport', region: 'EU', factor: 0.60, unit: 'kg CO2/ton-km', confidence: 'High', source: 'IPCC 2024' },
        { name: 'Cargo Ship (Standard)', category: 'Transport', region: 'Global', factor: 0.015, unit: 'kg CO2/kg-km', confidence: 'High', source: 'IMO Guidelines' },
        { name: 'Heavy Duty Truck', category: 'Transport', region: 'Global', factor: 0.1, unit: 'kg CO2/kg-km', confidence: 'High', source: 'DEPA Database' },
        { name: 'Grid Electricity', category: 'Energy', region: 'Asia', factor: 0.45, unit: 'kg CO2/kWh', confidence: 'Medium', source: 'IEA 2024' },
    ];

    const filteredRecords = data.rawRecords.filter(r =>
        r.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.material.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-wrapper fade-in" style={{ paddingTop: '0' }}>
            <div className="page-header">
                <h1 className="page-title">Calculation Engine</h1>
            </div>

            <div className="grid-2" style={{ gap: '32px' }}>
                <div className="card">
                    <h3 className="card-header">Activity Attribution Logic</h3>
                    <div style={{ padding: '32px', background: 'var(--bg-tertiary)', borderRadius: '24px', border: '2px dashed var(--border-color)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ padding: '16px 24px', background: '#fff', borderRadius: '16px', border: '1px solid var(--blue-primary)', boxShadow: 'var(--shadow-md)' }}>
                                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--blue-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>Asset Weight</div>
                                <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--text-primary)' }}>{sampleRecord.weight.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 600 }}>kg</span></div>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 300, color: 'var(--text-muted)' }}>×</div>
                            <div style={{ padding: '16px 24px', background: '#fff', borderRadius: '16px', border: '1px solid var(--green-primary)', boxShadow: 'var(--shadow-md)' }}>
                                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--green-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>Emission Factor</div>
                                <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--text-primary)' }}>{emissionFactor}</div>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 300, color: 'var(--text-muted)' }}>=</div>
                            <div style={{ padding: '20px 32px', background: 'var(--blue-primary)', borderRadius: '16px', color: '#fff', boxShadow: '0 8px 24px -6px rgba(74,127,184,0.4)' }}>
                                <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '8px' }}>Net Impact</div>
                                <div style={{ fontWeight: 800, fontSize: '28px' }}>{Math.round(sampleRecord.emissions).toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 600 }}>kgCO2e</span></div>
                            </div>
                        </div>
                        <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Formula: (Weight × Material Factor) + (Weight × Distance × Transport Factor)
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">Impact Distribution</h3>
                    <div className="grid-2" style={{ gap: '32px' }}>
                        <div>
                            <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{data.totalEmissions.toLocaleString()}</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '24px' }}>Total kgCO2e ({data.rawRecords.length} records)</div>
                            {data.categoryBreakdown.map((cat, i) => (
                                <div key={i} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                                        <span>{cat.name}</span>
                                        <span>{cat.percentage}%</span>
                                    </div>
                                    <div className="progress-bar" style={{ height: '8px', background: 'var(--gray-100)', borderRadius: '4px' }}>
                                        <div className="progress-fill" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color, borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                            <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--blue-primary)' }}>{data.categoryBreakdown.find(c => c.name === 'Materials')?.value.toLocaleString() || 0}</div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scope 3: Materials</div>
                            </div>
                            <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--green-primary)' }}>{data.categoryBreakdown.find(c => c.name === 'Logistics')?.value.toLocaleString() || 0}</div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scope 3: Logistics</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="card-header">Detailed Calculation Ledger</h3>
                    {!data.isFresh ? (
                        <>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    className="input"
                                    placeholder="Filter by supplier or material..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                                />
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ padding: '16px' }}>Activity Detail</th>
                                        <th>Material Intensity</th>
                                        <th>Logistics Intensity</th>
                                        <th>Total (kgCO2e)</th>
                                        <th style={{ textAlign: 'right', paddingRight: '24px' }}>Verification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map((r) => (
                                        <tr key={r.id} className="hover-light">
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>{r.supplier}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.material} • {r.weight.toLocaleString()}kg • {r.distance}km</div>
                                            </td>
                                            <td><span style={{ fontSize: '13px', fontWeight: 600 }}>{r.material}</span></td>
                                            <td><span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.transportMode}</span></td>
                                            <td><span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{r.emissions.toLocaleString()}</span></td>
                                            <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                                <span className="badge badge-blue" style={{ fontSize: '10px' }}>{r.weight > 0 && r.distance > 0 ? 'COMPLETE' : 'PARTIAL'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No data for calculation. Please ingest a dataset.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarbonCalculation;
