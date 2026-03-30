import React, { createContext, useContext, useState, ReactNode } from 'react';
import Papa from 'papaparse';

// --- Types ---

export interface RawRecord {
    id: string;
    date: string;
    supplier: string;
    material: string;
    weight: number;
    distance: number;
    transportMode: string;
    region: string;
    emissions: number;
}

export interface SupplierSummary {
    name: string;
    emissions: number;
    contribution: number;
    region: string;
    color: string;
}

export interface TransportSummary {
    mode: string;
    value: number;
    color: string;
    image?: string;
}

export interface MaterialSummary {
    name: string;
    percentage: number;
    color: string;
}

export interface CategorySummary {
    name: string;
    value: number;
    percentage: number;
    color: string;
}

export interface Recommendation {
    title: string;
    description: string;
    emissions: number;
    cost: string;
    savings: string;
    image: string;
}

export interface TrendData {
    month: string;
    emissions: number;
}

interface AppData {
    rawRecords: RawRecord[];
    suppliers: SupplierSummary[];
    transportModes: TransportSummary[];
    materials: MaterialSummary[];
    categoryBreakdown: CategorySummary[];
    recommendations: Recommendation[];
    trendData: TrendData[];
    totalEmissions: number;
    potentialReduction: number;
    isFresh: boolean;
    dataVersion: number;
}

interface DataContextType {
    data: AppData;
    parseRecords: (csvString: string) => RawRecord[];
    commitParsedData: (records: RawRecord[]) => void;
    resetToDefault: () => void;
    showNotification: (message: string, type?: 'success' | 'error') => void;
}

// --- Constants & Emission Factors ---

const EMISSION_FACTORS = {
    materials: {
        'Steel': 1.85,
        'Aluminum': 12.5,
        'Plastic': 6.0,
        'Cotton': 8.2,
        'Industrial Parts': 2.4,
        'Packaging': 0.8,
        'Wood': 0.5,
        'Glass': 1.2,
        'Copper': 3.7
    } as Record<string, number>,
    transport: {
        'Heavy Duty Truck': 0.1,
        'Cargo Ship': 0.015,
        'Ocean Vessel': 0.012,
        'Rail Freight': 0.03,
        'Air Cargo': 0.6,
        'Express Air': 0.8,
        'Intermodal Rail': 0.025
    } as Record<string, number>
};

const defaultData: AppData = {
    rawRecords: [],
    suppliers: [
        { name: 'Global Steel Co', emissions: 5400, contribution: 45, region: 'Asia', color: 'var(--blue-primary)' },
        { name: 'AluFab Ltd', emissions: 2800, contribution: 21, region: 'Europe', color: 'var(--green-primary)' },
    ],
    transportModes: [
        { mode: 'Heavy Duty Truck', value: 3500, color: '#ff9800' },
        { mode: 'Cargo Ship', value: 2500, color: '#2196f3' },
    ],
    materials: [
        { name: 'Steel', percentage: 50, color: '#4a7fb8' },
        { name: 'Aluminum', percentage: 30, color: '#5c8dc4' },
    ],
    categoryBreakdown: [
        { name: 'Materials', value: 7200, percentage: 65, color: '#4a7fb8' },
        { name: 'Logistics', value: 2500, percentage: 25, color: '#5cb860' },
        { name: 'Others', value: 1000, percentage: 10, color: '#f4b740' },
    ],
    recommendations: [],
    trendData: [
        { month: 'Jan', emissions: 1100 },
        { month: 'Feb', emissions: 1050 },
    ],
    totalEmissions: 10700,
    potentialReduction: 1500,
    isFresh: true,
    dataVersion: 1,
};

// --- Context & Provider ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData>(defaultData);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const parseRecords = (csvString: string): RawRecord[] => {
        // Use PapaParse with manual column identification for maximum robustness
        const results = Papa.parse(csvString, {
            header: true,
            skipEmptyLines: 'greedy',
            dynamicTyping: true,
            transformHeader: (h) => h.trim()
        });

        if (results.errors.length > 0) {
            console.error("CSV Parsing Errors:", results.errors);
        }

        const rawData = results.data as any[];
        if (rawData.length === 0) return [];

        const headers = Object.keys(rawData[0]);

        // Helper to find the best matching header key
        const getHeader = (variants: string[]) => {
            return headers.find(h => variants.includes(h.toLowerCase()));
        };

        const keyMap = {
            date: getHeader(['date', 'time', 'timestamp', 'period']),
            supplier: getHeader(['supplier', 'vendor', 'entity', 'company', 'name']),
            material: getHeader(['material', 'material type', 'type', 'item']),
            weight: getHeader(['weight', 'weight (kg)', 'kgs', 'mass', 'quantity']),
            distance: getHeader(['distance', 'distance (km)', 'km', 'length', 'trip']),
            mode: getHeader(['transportmode', 'transport mode', 'mode', 'method', 'logistics']),
            region: getHeader(['region', 'location', 'country', 'origin'])
        };

        return rawData
            .map((row: any, i: number) => {
                const weight = parseFloat(row[keyMap.weight || 'Weight'] || 0);
                const distance = parseFloat(row[keyMap.distance || 'Distance'] || 0);
                const material = String(row[keyMap.material || 'Material'] || 'Other');
                const mode = String(row[keyMap.mode || 'TransportMode'] || 'Heavy Duty Truck');
                const supplier = String(row[keyMap.supplier || 'Supplier'] || 'Unknown');
                const region = String(row[keyMap.region || 'Region'] || 'Global');
                const date = String(row[keyMap.date || 'Date'] || new Date().toISOString().split('T')[0]);

                // Determine Factors
                const mEF = EMISSION_FACTORS.materials[material] || 1.0;
                const tEF = EMISSION_FACTORS.transport[mode] || 0.05;

                // Formula: (Weight * Material Factor) + (Weight * Distance * Transport Factor)
                const emissions = (weight * mEF) + (weight * distance * tEF);

                // Validation: If weight is 0 or NaN, we likely missed the header or have bad data
                if (weight <= 0 && distance <= 0) {
                    // Fallback check: if row has any values but weight/dist are 0, headers are definitely wrong
                    return null;
                }

                return {
                    id: `rec-${i}-${Date.now()}`,
                    date,
                    supplier,
                    material,
                    weight,
                    distance,
                    transportMode: mode,
                    region,
                    emissions: Math.round(emissions * 10) / 10 // Store precise single decimal
                };
            })
            .filter((r): r is RawRecord => r !== null);
    };

    const commitParsedData = (records: RawRecord[]) => {
        if (!records || records.length === 0) return;

        // Merge with existing records instead of replacing
        const allRecords = [...data.rawRecords, ...records];
        
        let totalEmissions = 0;
        const supplierMap: Record<string, { emissions: number, region: string }> = {};
        const materialMap: Record<string, number> = {};
        const transportMap: Record<string, number> = {};
        const monthMap: Record<string, number> = {};

        allRecords.forEach(r => {
            totalEmissions += r.emissions;
            if (!supplierMap[r.supplier]) supplierMap[r.supplier] = { emissions: 0, region: r.region };
            supplierMap[r.supplier].emissions += r.emissions;
            materialMap[r.material] = (materialMap[r.material] || 0) + r.emissions;
            transportMap[r.transportMode] = (transportMap[r.transportMode] || 0) + r.emissions;

            const d = new Date(r.date);
            const month = isNaN(d.getTime()) ? 'Jan' : d.toLocaleString('default', { month: 'short' });
            monthMap[month] = (monthMap[month] || 0) + r.emissions;
        });

        const suppliersList = Object.entries(supplierMap)
            .map(([name, val]) => ({
                name,
                emissions: Math.round(val.emissions),
                contribution: Math.round((val.emissions / totalEmissions) * 100),
                region: val.region,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            }))
            .sort((a, b) => b.emissions - a.emissions);

        const materialsList = Object.entries(materialMap)
            .map(([name, val]) => ({
                name,
                percentage: Math.round((val / totalEmissions) * 100),
                color: `hsl(${(Math.random() * 60) + 200}, 60%, 50%)`
            }))
            .sort((a, b) => b.percentage - a.percentage);

        const transportList = Object.entries(transportMap)
            .map(([mode, value]) => ({
                mode,
                value: Math.round(value),
                color: `hsl(${(Math.random() * 60) + 100}, 50%, 45%)`
            }))
            .sort((a, b) => b.value - a.value);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendDataList = months
            .map(m => ({ month: m, emissions: Math.round(monthMap[m] || 0) }))
            .filter(t => t.emissions > 0);

        const recs: Recommendation[] = [];
        if (transportMap['Air Cargo'] || transportMap['Express Air']) {
            recs.push({
                title: 'Ocean Freight Transformation',
                description: 'Detected high-intensity air shipments. Transitioning to Sea could reduce logistics impact by 85%.',
                emissions: Math.round(((transportMap['Air Cargo'] || 0) + (transportMap['Express Air'] || 0)) * 0.4),
                cost: '$12,000',
                savings: '$95,000',
                image: '🚢'
            });
        }
        if (materialMap['Steel']) {
            recs.push({
                title: 'Green Steel Circularity',
                description: 'Integrate recycled steel components to lower primary extraction footprint.',
                emissions: Math.round(materialMap['Steel'] * 0.25),
                cost: '$18,000',
                savings: '$7,000',
                image: '♻️'
            });
        }

        const matVal = Object.values(materialMap).reduce((a, b) => a + b, 0);
        const logVal = Object.values(transportMap).reduce((a, b) => a + b, 0);

        setData({
            rawRecords: allRecords,
            suppliers: suppliersList,
            materials: materialsList,
            transportModes: transportList,
            categoryBreakdown: [
                { name: 'Materials', value: Math.round(matVal), percentage: Math.round((matVal / totalEmissions) * 100), color: '#4a7fb8' },
                { name: 'Logistics', value: Math.round(logVal), percentage: Math.round((logVal / totalEmissions) * 100), color: '#5cb860' },
                { name: 'Others', value: Math.round(totalEmissions * 0.1), percentage: 10, color: '#f4b740' },
            ],
            trendData: trendDataList,
            recommendations: recs,
            totalEmissions: Math.round(totalEmissions),
            potentialReduction: recs.reduce((a, b) => a + b.emissions, 0),
            isFresh: false,
            dataVersion: Date.now()
        });
        
        showNotification(`Successfully processed ${records.length} records. All dashboards updated.`, 'success');
    };

    const resetToDefault = () => setData({ ...defaultData, dataVersion: Date.now() });

    return (
        <DataContext.Provider value={{ data, parseRecords, commitParsedData, resetToDefault, showNotification }}>
            {children}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '16px 24px',
                    background: notification.type === 'success' ? 'var(--green-primary)' : 'var(--error-red)',
                    color: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    fontWeight: 600,
                    fontSize: '14px',
                    maxWidth: '400px'
                }}>
                    <span>{notification.message}</span>
                </div>
            )}
        </DataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error('useAppData must be used within a DataProvider');
    return context;
};
