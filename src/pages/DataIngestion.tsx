import React, { useState, useRef } from 'react';
import { useAppData, RawRecord } from '../context/DataContext';

interface UploadingFile {
    id: string;
    name: string;
    size: number;
    progress: number;
    status: 'uploading' | 'review' | 'completed';
}

const DataIngestion: React.FC = () => {
    const { parseRecords, commitParsedData, showNotification } = useAppData();
    const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
    const [dragOver, setDragOver] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [previewData, setPreviewData] = useState<RawRecord[]>([]);
    const [connectedApis, setConnectedApis] = useState<Record<string, 'disconnected' | 'connecting' | 'connected'>>({
        'DHL': 'connected', 'Maersk': 'disconnected', 'FedEx': 'disconnected'
    });
    const [manualData, setManualData] = useState({
        date: '',
        supplier: '',
        material: '',
        weight: '',
        distance: '',
        transportMode: '',
        region: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        const fileId = Math.random().toString(36).substring(7);
        
        setUploadingFiles([{ id: fileId, name: file.name, size: file.size, progress: 0, status: 'uploading' }]);
        setPreviewData([]);

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target?.result as string;
            
            let p = 0;
            const interval = setInterval(() => {
                p += 20;
                setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: p } : f));
                
                if (p >= 100) {
                    clearInterval(interval);
                    const records = parseRecords(csvText);
                    if (records.length === 0) {
                        showNotification("No valid records found. Check CSV format.", 'error');
                        setUploadingFiles([]);
                    } else {
                        setPreviewData(records);
                        setUploadingFiles([]);
                    }
                }
            }, 100);
        };
        reader.readAsText(file);
    };

    const handleConnectApi = (apiName: string) => {
        if (connectedApis[apiName] === 'connected') return;
        setConnectedApis(prev => ({ ...prev, [apiName]: 'connecting' }));
        setTimeout(() => {
            setConnectedApis(prev => ({ ...prev, [apiName]: 'connected' }));
            const partnerCSV = `Date,Supplier,Material,Weight,Distance,TransportMode,Region\n2024-05-15,${apiName} Partner,Industrial Parts,1200,4500,Cargo Ship,Asia\n2024-05-16,${apiName} Partner,Packaging,300,800,Heavy Duty Truck,Direct`;
            const records = parseRecords(partnerCSV);
            if (records.length > 0) {
                commitParsedData(records);
            }
        }, 1500);
    };

    const confirmImport = () => {
        if (previewData.length > 0) {
            commitParsedData(previewData);
            const uniqueSuppliers = new Set(previewData.map(r => r.supplier)).size;
            const uniqueMaterials = new Set(previewData.map(r => r.material)).size;
            showNotification(`Ingested ${previewData.length} rows, ${uniqueSuppliers} suppliers, ${uniqueMaterials} materials detected`, 'success');
            setPreviewData([]);
            setUploadingFiles([]);
        }
    };

    const handleManualSubmit = () => {
        if (!manualData.date || !manualData.supplier || !manualData.material || !manualData.weight) {
            showNotification('Please fill all required fields', 'error');
            return;
        }
        
        const csvString = `Date,Supplier,Material,Weight,Distance,TransportMode,Region\n${manualData.date},${manualData.supplier},${manualData.material},${manualData.weight},${manualData.distance || 0},${manualData.transportMode || 'Heavy Duty Truck'},${manualData.region || 'Global'}`;
        const records = parseRecords(csvString);
        if (records.length > 0) {
            commitParsedData(records);
            setManualData({ date: '', supplier: '', material: '', weight: '', distance: '', transportMode: '', region: '' });
        }
    };

    const downloadSample = () => {
        const csvContent = "Date,Supplier,Material,Weight,Distance,TransportMode,Region\n2024-01-10,Tesla Energy,Aluminum,1500,800,Cargo Ship,North America\n2024-02-05,Vulcan Steel,Steel,5000,120,Heavy Duty Truck,Europe\n2024-03-12,GreenPolymer,Plastic,800,2400,Cargo Ship,Asia\n2024-04-10,Ameco Logistics,Steel,2200,450,Heavy Duty Truck,Asia";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'carbon_sample.csv';
        a.click();
    };

    return (
        <div className="page-wrapper fade-in" style={{ paddingTop: '0' }}>
            <div className="page-header">
                <h1 className="page-title">Intelligence Intake</h1>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button 
                        onClick={() => setActiveTab('upload')}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            background: activeTab === 'upload' ? 'linear-gradient(135deg, var(--blue-primary) 0%, #5c8dc4 100%)' : 'var(--bg-tertiary)',
                            color: activeTab === 'upload' ? '#fff' : 'var(--text-secondary)',
                            boxShadow: activeTab === 'upload' ? '0 4px 12px rgba(74,127,184,0.3)' : 'none',
                            transform: activeTab === 'upload' ? 'translateY(-2px)' : 'none'
                        }}
                    >
                        File Upload
                    </button>
                    <button 
                        onClick={() => setActiveTab('manual')}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            background: activeTab === 'manual' ? 'linear-gradient(135deg, var(--green-primary) 0%, #6ca755 100%)' : 'var(--bg-tertiary)',
                            color: activeTab === 'manual' ? '#fff' : 'var(--text-secondary)',
                            boxShadow: activeTab === 'manual' ? '0 4px 12px rgba(124,184,96,0.3)' : 'none',
                            transform: activeTab === 'manual' ? 'translateY(-2px)' : 'none'
                        }}
                    >
                        Manual Entry
                    </button>
                    <button onClick={downloadSample} className="btn btn-outline" style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}>Download Template</button>
                </div>
            </div>

            <div className="grid-2" style={{ gap: '32px' }}>
                <div className="card" style={{ gridColumn: previewData.length > 0 ? 'span 2' : 'auto' }}>
                    <h3 className="card-header">{activeTab === 'upload' ? 'Data Extraction & Normalization' : 'Manual Data Entry'}</h3>
                    
                    {activeTab === 'upload' ? (
                        previewData.length === 0 ? (
                            <>
                                <input ref={fileInputRef} type="file" accept=".csv" onChange={(e) => handleFileUpload(e.target.files)} style={{ display: 'none' }} />
                                <div
                                    className="upload-area"
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        background: dragOver ? 'linear-gradient(135deg, var(--blue-light) 0%, rgba(74,127,184,0.1) 100%)' : 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--gray-50) 100%)',
                                        border: dragOver ? '3px dashed var(--blue-primary)' : '3px dashed var(--border-color)',
                                        borderRadius: '24px',
                                        padding: '64px 32px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ fontSize: '64px', marginBottom: '20px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>📊</div>
                                    <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Drop Dataset for Extraction</div>
                                    <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '20px' }}>CSV processing with deterministic emission factor mapping</p>
                                    <div style={{ 
                                        display: 'inline-block',
                                        padding: '12px 24px', 
                                        background: 'linear-gradient(135deg, var(--blue-primary) 0%, #5c8dc4 100%)',
                                        color: '#fff',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: 800,
                                        boxShadow: '0 4px 12px rgba(74,127,184,0.3)'
                                    }}>🔗 SAP/ERP COMPATIBLE</div>
                                </div>
                            </>
                        ) : (
                            <div className="slide-up">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '16px', background: 'var(--blue-light)', borderRadius: '16px', border: '1px solid var(--blue-primary)33' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: 'var(--blue-primary)', fontSize: '16px' }}>Extraction Successful</div>
                                        <div style={{ fontSize: '12px', color: 'var(--blue-primary)' }}>
                                            {previewData.length} records | {new Set(previewData.map(r => r.supplier)).size} suppliers | {new Set(previewData.map(r => r.material)).size} materials detected
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => setPreviewData([])} className="btn btn-outline" style={{ background: '#fff' }}>Discard</button>
                                        <button onClick={confirmImport} className="btn btn-primary">Inject to Dashboards</button>
                                    </div>
                                </div>
                                <div style={{ maxHeight: '400px', overflow: 'auto', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                    <table className="data-table">
                                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-tertiary)' }}>
                                            <tr>
                                                <th style={{ padding: '16px' }}>Supplier / Date</th>
                                                <th>Material</th>
                                                <th>Weight</th>
                                                <th>Logistics</th>
                                                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Impact (kgCO2e)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, i) => (
                                                <tr key={i} className="hover-light">
                                                    <td style={{ padding: '16px' }}>
                                                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{row.supplier}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.date}</div>
                                                    </td>
                                                    <td style={{ fontSize: '13px', fontWeight: 600 }}>{row.material}</td>
                                                    <td style={{ fontSize: '13px' }}>{row.weight.toLocaleString()} kg</td>
                                                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{row.transportMode}</td>
                                                    <td style={{ textAlign: 'right', paddingRight: '24px', fontWeight: 800, color: 'var(--blue-primary)' }}>{Math.round(row.emissions).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    ) : (
                        <div style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Date</label>
                                        <input 
                                            type="date" 
                                            value={manualData.date}
                                            onChange={(e) => setManualData({...manualData, date: e.target.value})}
                                            style={{ 
                                                width: '100%', 
                                                padding: '12px 16px', 
                                                borderRadius: '12px',
                                                border: '2px solid var(--border-color)',
                                                fontSize: '14px',
                                                transition: 'all 0.2s',
                                                background: '#fff'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--blue-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Supplier</label>
                                        <input 
                                            type="text" 
                                            value={manualData.supplier}
                                            onChange={(e) => setManualData({...manualData, supplier: e.target.value})}
                                            placeholder="e.g., Tesla Energy"
                                            style={{ 
                                                width: '100%', 
                                                padding: '12px 16px', 
                                                borderRadius: '12px',
                                                border: '2px solid var(--border-color)',
                                                fontSize: '14px',
                                                transition: 'all 0.2s',
                                                background: '#fff'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--blue-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                        />
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Material</label>
                                        <select 
                                            value={manualData.material}
                                            onChange={(e) => setManualData({...manualData, material: e.target.value})}
                                            style={{ 
                                                width: '100%', 
                                                padding: '12px 16px', 
                                                borderRadius: '12px',
                                                border: '2px solid var(--border-color)',
                                                fontSize: '14px',
                                                transition: 'all 0.2s',
                                                background: '#fff',
                                                cursor: 'pointer'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--blue-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                        >
                                            <option value="">Select material type</option>
                                            <option value="Steel">Steel</option>
                                            <option value="Aluminum">Aluminum</option>
                                            <option value="Plastic">Plastic</option>
                                            <option value="Cotton">Cotton</option>
                                            <option value="Industrial Parts">Industrial Parts</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Weight (kg)</label>
                                        <input 
                                            type="number" 
                                            value={manualData.weight}
                                            onChange={(e) => setManualData({...manualData, weight: e.target.value})}
                                            placeholder="1500"
                                            style={{ 
                                                width: '100%', 
                                                padding: '12px 16px', 
                                                borderRadius: '12px',
                                                border: '2px solid var(--border-color)',
                                                fontSize: '14px',
                                                transition: 'all 0.2s',
                                                background: '#fff'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--blue-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                        />
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Distance (km)</label>
                                        <input 
                                            type="number" 
                                            value={manualData.distance}
                                            onChange={(e) => setManualData({...manualData, distance: e.target.value})}
                                            placeholder="800"
                                            style={{ 
                                                width: '100%', 
                                                padding: '12px 16px', 
                                                borderRadius: '12px',
                                                border: '2px solid var(--border-color)',
                                                fontSize: '14px',
                                                transition: 'all 0.2s',
                                                background: '#fff'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--green-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Transport Mode</label>
                                        <select 
                                            value={manualData.transportMode}
                                            onChange={(e) => setManualData({...manualData, transportMode: e.target.value})}
                                            style={{ 
                                                width: '100%', 
                                                padding: '12px 16px', 
                                                borderRadius: '12px',
                                                border: '2px solid var(--border-color)',
                                                fontSize: '14px',
                                                transition: 'all 0.2s',
                                                background: '#fff',
                                                cursor: 'pointer'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--green-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                        >
                                            <option value="">Select transport method</option>
                                            <option value="Heavy Duty Truck">Heavy Duty Truck</option>
                                            <option value="Cargo Ship">Cargo Ship</option>
                                            <option value="Air Cargo">Air Cargo</option>
                                            <option value="Rail Freight">Rail Freight</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Region</label>
                                    <input 
                                        type="text" 
                                        value={manualData.region}
                                        onChange={(e) => setManualData({...manualData, region: e.target.value})}
                                        placeholder="North America"
                                        style={{ 
                                            width: '100%', 
                                            padding: '12px 16px', 
                                            borderRadius: '12px',
                                            border: '2px solid var(--border-color)',
                                            fontSize: '14px',
                                            transition: 'all 0.2s',
                                            background: '#fff'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--green-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    />
                                </div>
                                
                                <button 
                                    onClick={handleManualSubmit}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, var(--green-primary) 0%, #6ca755 100%)',
                                        color: '#fff',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 4px 12px rgba(124,184,96,0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        const target = e.target as HTMLButtonElement;
                                        target.style.transform = 'translateY(-2px)';
                                        target.style.boxShadow = '0 6px 20px rgba(124,184,96,0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        const target = e.target as HTMLButtonElement;
                                        target.style.transform = 'translateY(0)';
                                        target.style.boxShadow = '0 4px 12px rgba(124,184,96,0.3)';
                                    }}
                                >
                                    Add Record to Dataset
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {previewData.length === 0 && activeTab === 'upload' && (
                    <div className="card">
                        <h3 className="card-header">Direct Logistics Integration</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { name: 'DHL Express', id: 'DHL', freq: 'Every 15m' },
                                { name: 'Maersk Global', id: 'Maersk', freq: 'Daily Sync' },
                                { name: 'FedEx Logistics', id: 'FedEx', freq: 'Every 1h' }
                            ].map(api => (
                                <div key={api.id} style={{
                                    padding: '16px',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }} className="hover-light">
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            background: connectedApis[api.id] === 'connected' ? 'var(--green-light)' : 'var(--gray-100)',
                                            color: connectedApis[api.id] === 'connected' ? 'var(--green-primary)' : 'var(--text-muted)',
                                            fontSize: '10px',
                                            fontWeight: 800
                                        }}>
                                            {connectedApis[api.id] === 'connected' ? 'MOCK/SIMULATED' : connectedApis[api.id]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{api.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{api.freq}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleConnectApi(api.id)}
                                        className={`btn ${connectedApis[api.id] === 'connected' ? 'btn-outline' : 'btn-primary'}`}
                                        style={{ height: '36px', padding: '0 16px', fontSize: '12px', fontWeight: 700 }}
                                    >
                                        {connectedApis[api.id] === 'connected' ? 'Sync' : 'Connect'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataIngestion;