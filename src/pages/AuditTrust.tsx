import React from 'react';
import { useAppData } from '../context/DataContext';

const AuditTrust: React.FC = () => {
    const { data } = useAppData();
    const lastUpdated = new Date(data.dataVersion).toLocaleString();
    const uploadedFileName = data.isFresh ? 'No file uploaded' : 'dataset.csv';
    const completenessScore = data.rawRecords.length > 0 ? 
        Math.round((data.rawRecords.filter(r => r.weight > 0 && r.distance > 0).length / data.rawRecords.length) * 100) : 0;
    const factorCoverage = data.materials.length + data.transportModes.length;
    const qualityScore = Math.min(95, Math.round((completenessScore * 0.6) + (Math.min(factorCoverage * 5, 40))));

    const methodologySteps = [
        {
            step: 'Activity Categorization',
            desc: data.isFresh
                ? 'Normalize raw procurement records into GWP-100 standard metrics.'
                : `Successfully normalized ${data.rawRecords.length} raw procurement records into GWP-100 standard metrics.`,
            color: 'var(--blue-primary)'
        },
        {
            step: 'Emission Factor Mapping',
            desc: data.isFresh
                ? 'Autonomous mapping to material IDs via IPCC 2024 refinement databases.'
                : `Autonomous mapping to ${data.materials.length} material types and ${data.transportModes.length} transport modes using IPCC 2024 and Ecoinvent 3.10 databases.`,
            color: 'var(--green-primary)'
        },
        {
            step: 'Aggregation & Scoring',
            desc: `Final footprint summation: ${data.totalEmissions.toLocaleString()} kgCO2e across ${data.suppliers.length} suppliers with ${qualityScore}% confidence scoring.`,
            color: 'var(--text-primary)'
        }
    ];

    return (
        <div className="page-wrapper fade-in" style={{ paddingTop: '0' }}>
            <div className="page-header">
                <h1 className="page-title">Audit & Verification Suite</h1>
            </div>

            <div className="grid-2" style={{ gap: '32px' }}>
                <div className="card">
                    <h3 className="card-header">Calculation Lineage & Source Trace</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Client Dataset', source: uploadedFileName, type: 'Primary Feed', status: data.isFresh ? 'offline' : 'verified' },
                            { label: 'Calculated Intelligence', source: `Internal Engine v1.0.4 (${data.rawRecords.length} records)`, type: 'Deterministic Logic', status: data.isFresh ? 'offline' : 'live' },
                            { label: 'Emission Factor DB', source: 'IPCC / Ecoinvent 3.10', type: 'Static Reference', status: 'verified' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="hover-light">
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>{item.label}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Source: {item.source} | Access: {item.type}</div>
                                </div>
                                <div className={`badge badge-${item.status === 'offline' ? 'yellow' : (item.status === 'live' ? 'blue' : 'green')}`} style={{ fontSize: '10px', fontWeight: 800, padding: '4px 10px' }}>
                                    {item.status.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-outline" style={{ width: '100%', marginTop: '24px', fontWeight: 700 }}>Request Deep-Trace Audit</button>
                </div>

                <div className="card">
                    <h3 className="card-header">Standardized Methodology Trail</h3>
                    <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px solid var(--gray-100)', marginLeft: '12px' }}>
                        {methodologySteps.map((step, idx) => (
                            <div key={idx} style={{ marginBottom: '32px', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '-41px',
                                    top: '0',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    border: `4px solid ${step.color}`,
                                    boxShadow: 'var(--shadow-sm)'
                                }}></div>
                                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>Step {idx + 1}: {step.step}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">Governing Standards & Citations</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, fontSize: '16px' }}>IPCC Guidelines 2024</span>
                                <div className="badge badge-green" style={{ padding: '4px 12px' }}>Referenced for prototype</div>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Conceptual reference for baseline factors. 2024 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories.</p>
                        </div>
                        <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, fontSize: '16px' }}>GHG Protocol Compliant</span>
                                <span style={{ fontSize: '10px', padding: '4px 10px', background: 'var(--blue-light)', color: 'var(--blue-primary)', borderRadius: '20px', fontWeight: 800 }}>CONCEPTUAL</span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Calculations follow the Corporate Value Chain (Scope 3) Standard methodology for Category 1, 4, and 5 reporting.</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">Data Quality & Security Index</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '16px 8px' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: `conic-gradient(var(--blue-primary) ${data.isFresh ? '0' : qualityScore}%, var(--gray-100) 0%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '84px',
                                height: '84px',
                                borderRadius: '50%',
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: 800,
                                fontFamily: 'var(--font-heading)'
                            }}>{data.isFresh ? '0' : qualityScore}<span style={{ fontSize: '14px', fontWeight: 600 }}>%</span></div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Data Quality Score</div>
                            <div style={{ fontWeight: 800, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '4px' }}>{data.isFresh ? 'Pending Evaluation' : `${qualityScore}% Reliability Rating`}</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Score: {completenessScore}% completeness + {Math.min(factorCoverage * 5, 40)}% factor coverage = {qualityScore}% total quality.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditTrust;
